import os
import uuid
import wave
from google import genai
from google.genai import types
from fastapi import HTTPException
from pathlib import Path

# Configure static directory
STATIC_DIR = Path("static/audio")
STATIC_DIR.mkdir(parents=True, exist_ok=True)

def generate_audio_from_text(text: str, tone: str = "calm", gender: str = "female", voice_name: str = None) -> str:
    """
    Generates audio from text using Gemini TTS with specific voice configuration.
    Converts raw PCM L16 output to WAV.
    """
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")
        
        client = genai.Client(api_key=api_key)
        
        # Using the requested model
        model_name = "gemini-2.5-flash-preview-tts" 
        
        # Map frontend tones AND gender to specific Gemini voices
        # Gemini Voices:
        # PUCK (Male, Clear)
        # CHARON (Male, Deep)
        # KORE (Female, Calm)
        # FENRIR (Male, Deep/Steady) - Wait, Fenrir is often listed as 'Deep'
        # AOEDE (Female, Gentle)
        
        voice_mapping = {
            # Female Voices
            ('calm-soothing', 'female'): 'Kore',
            ('clear-steady', 'female'): 'Kore', # Or maybe Aoede if more steady?
            ('relaxed-tone', 'female'): 'Aoede',
            ('gentle-peaceful', 'female'): 'Aoede',
            
            # Male Voices
            ('calm-soothing', 'male'): 'Charon',
            ('clear-steady', 'male'): 'Puck',
            ('relaxed-tone', 'male'): 'Fenrir',
            ('gentle-peaceful', 'male'): 'Charon',
            
            # Fallbacks
            ('calm', 'female'): 'Kore',
            ('calm', 'male'): 'Charon',
        }
        
        # Single request strategy - No chunking
        
        # Retrieve voice preference
        # logic: try specific tuple, then try just tone? No, gender is mandatory now.
        selected_voice = voice_mapping.get((tone, gender), voice_name)
        
        if not selected_voice:
             # Fallback if specific combo missing
             selected_voice = 'Kore' if gender == 'female' else 'Charon'
        
        print(f"Generating audio for text ({len(text)} chars) with tone {tone}, gender {gender} -> voice {selected_voice}...")

        prompt = f'Please read the following text aloud with a {tone} tone: "{text}"'

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=selected_voice
                        )
                    )
                )
            )
        )

        all_audio_data = bytearray()
        
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    all_audio_data.extend(part.inline_data.data)
                    
        if not all_audio_data:
             raise ValueError("No audio data received from Gemini API.")

        # Save to file as WAV
        # L16 @ 24kHz usually means: 1 channel, 2 bytes (16 bit), 24000 Hz
        filename = f"{uuid.uuid4()}.wav"
        filepath = STATIC_DIR / filename
        
        with wave.open(str(filepath), "wb") as wav_file:
            wav_file.setnchannels(1) # Mono
            wav_file.setsampwidth(2) # 16-bit
            wav_file.setframerate(24000)
            wav_file.writeframes(all_audio_data)
            
        # Return relative URL path (assuming /static mount)
        return f"/static/audio/{filename}"

    except Exception as e:
        print(f"Error in TTS generation: {e}")
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")
