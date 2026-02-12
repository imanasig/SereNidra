from google import genai
from google.genai import types
import os
import uuid
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None
    print("Warning: GOOGLE_API_KEY not found. TTS service will fail.")

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

async def generate_audio(text: str, voice_gender: str = "Female") -> tuple[str, float]:
    """
    Generates audio from text using Gemini TTS.
    Returns the relative path to the generated audio file.
    """
    if not client:
        raise Exception("TTS Service not configured: Missing API Key")

    try:
        model_name = "gemini-2.5-flash-preview-tts"
        
        # Note: Gemini TTS might not support specific voice selection via simple string yet 
        # in the preview, or it might infer from context. 
        # We can try to prompt it or use config if available.
        # For now, we follow the simple generation pattern.
        
        response = client.models.generate_content(
            model=model_name,
            contents=types.Content(
                parts=[types.Part(text=text)]
            ),
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"]
            )
        )
        
        audio_data = None
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    audio_data = part.inline_data.data
                    break
        
        if not audio_data:
            raise Exception("No audio data returned from Gemini")
            
        # Save file
        filename = f"{uuid.uuid4()}.wav"
        filepath = os.path.join(AUDIO_DIR, filename)
        
        # Gemini 2.5 Flash Preview TTS returns raw PCM data.
        # We need to wrap it in a WAV container.
        # Assuming 24kHz, 1 channel, 16-bit PCM based on testing.
        duration_seconds = 0
        try:
             import wave
             import math
             with wave.open(filepath, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2) # 16-bit
                wav_file.setframerate(24000)
                wav_file.writeframes(audio_data)
                
                # Calculate duration
                n_frames = wav_file.getnframes()
                # Frame rate is 24000
                duration_seconds = n_frames / 24000.0
                
        except Exception as wav_error:
             print(f"Error writing WAV header: {wav_error}")
             # Fallback to raw write if wave module fails, though unwrapped it won't play in browsers
             with open(filepath, "wb") as f:
                f.write(audio_data)
            
        return f"/static/audio/{filename}", duration_seconds
        
    except Exception as e:
        print(f"Error in generate_audio: {e}")
        raise e
