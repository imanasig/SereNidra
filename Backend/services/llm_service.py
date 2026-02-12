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
    title: str = Field(description="A short, poetic title for the meditation (max 6 words)")
    visual_script: str = Field(description="The markdown formatted script for reading")
    audio_script: str = Field(description="The plain text script for audio generation")

class MoodSuggestion(BaseModel):
    suggested_type: str = Field(description="Recommended meditation type (e.g., stress relief, sleep, focus)")
    suggested_duration: int = Field(description="Recommended duration in minutes (5, 10, or 15)")
    suggested_tone: str = Field(description="Recommended voice tone (e.g., Calm, Reassuring, Gentle)")
    suggested_focus_areas: str = Field(description="A concise string of specific focus areas based on the mood (e.g., 'Soothe anxiety, relax chest tension, grounding breath')")

def analyze_mood(mood_text: str):
    if not api_key:
        raise Exception("Google API Key not found")
        
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)
    parser = JsonOutputParser(pydantic_object=MoodSuggestion)
    
    template = """
    You are an emotional wellness assistant.
    Based on the user’s described emotional state: "{mood_text}"
    
    Suggest:
    1. Meditation type (stress relief, sleep, focus, anxiety reduction, etc.)
    2. Ideal duration (5, 10, or 15 minutes) - choose what fits the urgency/severity.
    3. Voice tone (choose from: Calm, Reassuring, Gentle, Warm, Grounding, Uplifting)
    4. Specific Focus Areas: Elaborate on 2-3 specific things to focus on during the meditation to help with this mood. 
       Do NOT just copy the mood. For example, if mood is "Anxious", suggest "Release chest tightness, slow rhythmic breathing, grounding techniques".
    
    Return JSON only.
    {format_instructions}
    """
    
    prompt = PromptTemplate(
        input_variables=["mood_text"],
        template=template,
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"mood_text": mood_text})
        return result
    except Exception as e:
        print(f"Mood analysis failed: {e}")
        # Fallback
        return {
            "suggested_type": "Stress Relief",
            "suggested_duration": 10,
            "suggested_tone": "Calm",
            "suggested_focus_areas": "General relaxation"
        }

def generate_meditation_script(type: str, duration: int, preferences: str, tone: str, health_conditions: list = None, mood_before: str = None):
    if not api_key:
        raise Exception("Google API Key not found")

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)

    parser = JsonOutputParser(pydantic_object=MeditationScripts)

    # Build health context string
    health_context = ""
    if health_conditions:
        health_context = "\nThe user has the following health conditions/considerations:\n- " + "\n- ".join(health_conditions)
        health_context += """
        
        GUARDRAILS FOR HEALTH CONDITIONS:
        - Do NOT give medical advice or clinical claims.
        - Avoid breathing instructions that may be unsafe for people with hypertension or respiratory issues.
        - Avoid intense body scans for chronic pain; keep them gentle and soft.
        - Use compassionate, non-judgmental language.
        - If 'Insomnia' is present: Avoid stimulating language, use soft pacing and slow cues.
        - If 'Anxiety' is present: Focus on grounding, sensory awareness, and avoid overwhelming metaphors.
        - If 'Depression' is present: Avoid toxic positivity or "fix yourself" language; use gentle acceptance.
        - If 'Burnout' is present: Avoid productivity language; emphasize permission to rest.
        """

    mood_context = f"\nThe user's current mood is: {mood_before}" if mood_before else ""

    # Calculate approximate target (simpler guidance)
    approx_words = duration * 130
    
    template = """
    You are an expert meditation instructor.
    
    GOAL: Create a sleep meditation script that fits EXACTLY into {duration} minutes.
    
    Data:
    - Type: {type}
    - User Mood: {mood_context}
    - Health: {health_context}
    - Tone: {tone}
    - Focus: {preferences}

    CRITICAL INSTRUCTIONS FOR LENGTH:
    1. Target Word Count: Approximately {approx_words} words.
    2. DO NOT EXCEED {duration} MINUTES of speaking time.
    3. KEEP IT BRIEF. It is better to have a slightly shorter script with pauses than a script that rushes.
    4. If the requested duration is short (e.g. 1-2 mins), generate ONLY a few soothing sentences.

    OUTPUT FORMAT (JSON):
    {{
        "title": "Short Title",
        "visual_script": "Markdown script with **bolding** and [PAUSE] instructions.",
        "audio_script": "Plain text for TTS. NO bolding. NO instructions like [PAUSE]. Just the spoken words."
    }}

    Structure matches {duration} minutes:
    - Brief settling in
    - Core practice
    - Gentle closing

    {format_instructions}
    """

    prompt = PromptTemplate(
        input_variables=["type", "duration", "preferences", "tone", "health_context", "mood_context", "approx_words"],
        template=template,
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    chain = prompt | llm | parser

    result = chain.invoke({
        "type": type,
        "duration": duration,
        "preferences": preferences if preferences else "General relaxation",
        "tone": tone,
        "health_context": health_context if health_context else "None provided.",
        "mood_context": mood_context if mood_context else "Neutral",
        "approx_words": approx_words
    })

    return result
