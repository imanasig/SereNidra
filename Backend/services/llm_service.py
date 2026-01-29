import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

class MeditationScripts(BaseModel):
    visual_script: str = Field(description="The markdown formatted script for reading")
    audio_script: str = Field(description="The plain text script for audio generation")

def generate_meditation_script(type: str, duration: int, preferences: str, tone: str):
    if not api_key:
        raise Exception("Google API Key not found")

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)

    parser = JsonOutputParser(pydantic_object=MeditationScripts)

    template = """
    You are an expert meditation instructor. Create a personalized sleep meditation script based on the following details:

    Meditation Type: {type}
    Duration: {duration} minutes
    User Preferences/Focus Areas: {preferences}
    Voice Tone/Style: {tone}

    You must generate TWO versions of the script in a valid JSON format:
    1. "visual_script": A highly readable, markdown-formatted script for the user to read on screen.
       - Use bolding (**) for headers and key phrases.
       - Include visual cues like [PAUSE] on a separate line.
    
    2. "audio_script": A narration-optimized plain text version for Text-to-Speech engines.
       - REMOVE all markdown bolding (**).
       - REMOVE all visual cues/instructions like [PAUSE] or [LONG PAUSE].
       - Ensure the text flows naturally for speech synthesis.
       - Do not include headers like "Introduction" or "Body" unless they should be spoken aloud (usually they shouldn't). Just the spoken words.

    Structure:
    - Introduction (settling in)
    - Body (the core meditation practice)
    - Conclusion (gently waking or drifting to sleep)

    {format_instructions}
    """

    prompt = PromptTemplate(
        input_variables=["type", "duration", "preferences", "tone"],
        template=template,
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    # Use LCEL: Prompt | LLM | Parser
    chain = prompt | llm | parser

    result = chain.invoke({
        "type": type,
        "duration": duration,
        "preferences": preferences if preferences else "General relaxation",
        "tone": tone
    })

    return result

