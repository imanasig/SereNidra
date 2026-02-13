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

# AUDIO_DIR = "static/audio"
# os.makedirs(AUDIO_DIR, exist_ok=True)

# from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent.parent
# AUDIO_DIR = BASE_DIR / "static" / "audio"
# AUDIO_DIR.mkdir(parents=True, exist_ok=True)

from pathlib import Path

AUDIO_DIR = Path("static/audio")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

async def generate_audio(text: str, voice_gender: str = "Female") -> tuple[str, float]:
    if not client:
        raise Exception("TTS Service not configured: Missing API Key")

    try:
        model_name = "gemini-2.5-flash-preview-tts"

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

        filename = f"{uuid.uuid4()}.wav"
        filepath = AUDIO_DIR / filename

        import wave

        # Write WAV file properly
        with wave.open(str(filepath), "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(24000)
            wav_file.writeframes(audio_data)

        # Calculate duration safely
        duration_seconds = len(audio_data) / (24000 * 2)

        return f"/static/audio/{filename}", duration_seconds

    except Exception as e:
        print(f"Error in generate_audio: {e}")
        raise e
