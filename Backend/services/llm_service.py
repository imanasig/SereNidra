from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

def generate_meditation_script(type: str, duration: int, preferences: str, tone: str):
    if not api_key:
        raise Exception("Google API Key not found")

    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key)

    template = """
    You are an expert meditation instructor. Create a personalized sleep meditation script based on the following details:

    Meditation Type: {type}
    Duration: {duration} minutes
    User Preferences/Focus Areas: {preferences}
    Voice Tone/Style: {tone}

    Instructions:
    1. The script should be formatted for easy reading and speaking.
    2. Include pause indicators like [PAUSE 5s] or [LONG PAUSE] where appropriate.
    3. The content should be enough to fill approximately {duration} minutes when spoken at a {tone} pace.
    4. Focus deeply on the user's specific preferences: {preferences}.
    5. **CRITICAL**: Use double asterisks (**) to bold the Section Headers (e.g., **Introduction**, **Body**, **Conclusion**) and key affirmations. This is required for the frontend to render them correctly.
    
    Structure:
    - **Introduction** (settling in)
    - **Body** (the core meditation practice)
    - **Conclusion** (gently waking or drifting to sleep)

    Generate the script now.
    """

    prompt = PromptTemplate(
        input_variables=["type", "duration", "preferences", "tone"],
        template=template,
    )

    # Use LCEL: Prompt | LLM | Parser
    chain = prompt | llm | StrOutputParser()

    result = chain.invoke({
        "type": type,
        "duration": duration,
        "preferences": preferences if preferences else "General relaxation",
        "tone": tone
    })

    return result
