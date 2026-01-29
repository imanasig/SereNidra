from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import traceback

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

client = genai.Client(api_key=api_key)

model_name = "gemini-2.5-flash-preview-tts"

print(f"Testing model: {model_name}")

try:
    text = 'Please read the following text aloud: "This is a test of the audio generation."'
    
    print("Sending request...")
    response = client.models.generate_content(
        model=model_name,
        contents=types.Content(
            parts=[types.Part(text=text)]
        ),
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            response_mime_type="audio/wav"
        )
    )
    
    print("Response received.")
    
    # In the new SDK, binary parts might be handled differently.
    # Typically response.parts[0].inline_data
    
    audio_data = None
    if response.candidates and response.candidates[0].content.parts:
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                audio_data = part.inline_data.data
                print(f"Found inline data with mime_type: {part.inline_data.mime_type}")
                break
    
    if audio_data:
        print(f"Success! Got {len(audio_data)} bytes.")
        with open("test_output.wav", "wb") as f:
            f.write(audio_data)
        print("Saved to test_output.wav")
    else:
        print("No audio data found in response.")
        print(response)

except Exception as e:
    print("An error occurred:")
    traceback.print_exc()
