from google import genai
from google.genai import types
import os
import wave
from dotenv import load_dotenv
import traceback

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

model_name = "gemini-2.5-flash-preview-tts"

# Simulate a long meditation script
long_text = "Relax your body. " * 50 # ~850 characters
print(f"Testing model: {model_name} with text length: {len(long_text)}")

# Chunking strategy
MAX_CHUNK_SIZE = 300
import re
sentences = re.split(r'(?<=[.!?]) +', long_text)

chunks = []
current_chunk = ""

for sentence in sentences:
    if len(current_chunk) + len(sentence) < MAX_CHUNK_SIZE:
        current_chunk += sentence + " "
    else:
        chunks.append(current_chunk.strip())
        current_chunk = sentence + " "
if current_chunk:
    chunks.append(current_chunk.strip())
    
print(f"Split text into {len(chunks)} chunks.")

all_audio_data = bytearray()

try:
    for i, chunk in enumerate(chunks):
        if not chunk: continue
        print(f"Processing chunk {i+1}...")
        
        response = client.models.generate_content(
            model=model_name,
            contents=f'Please read the following text aloud: "{chunk}"',
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Puck'
                        )
                    )
                )
            )
        )
        
        chunk_data = None
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    chunk_data = part.inline_data.data
                    break
        
        if chunk_data:
            all_audio_data.extend(chunk_data)
        else:
            print(f"Failed to get audio for chunk {i+1}")

    if all_audio_data:
        with wave.open("test_long_output_chunked.wav", "wb") as wav_file:
            wav_file.setnchannels(1) 
            wav_file.setsampwidth(2) 
            wav_file.setframerate(24000)
            wav_file.writeframes(all_audio_data)
        print("Saved to test_long_output_chunked.wav")
    else:
        print("No audio data found.")

except Exception as e:
    print("An error occurred:")
    traceback.print_exc()
