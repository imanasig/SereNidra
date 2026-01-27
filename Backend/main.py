import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas
from services.llm_service import generate_meditation_script
from auth import get_current_user

# Load environment variables from .env file
load_dotenv()

# Initialize Database Models
models.Base.metadata.create_all(bind=engine)

# Initialize Google Generative AI
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
    genai_configured = False
else:
    genai.configure(api_key=api_key)
    genai_configured = True

app = FastAPI(title="Sleep Meditation Generator API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sleep Meditation Generator Backend Running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from typing import List

@app.post("/api/meditations/generate", response_model=schemas.MeditationResponse)
async def generate_meditation(
    request: schemas.MeditationRequest, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        # Generate script using LangChain/Gemini
        script = generate_meditation_script(
            type=request.type,
            duration=request.duration,
            preferences=request.preferences,
            tone=request.tone
        )
        
        # Save to Database
        db_session = models.MeditationSession(
            type=request.type,
            duration=request.duration,
            preferences=request.preferences,
            tone=request.tone,
            script=script,
            user_id=user['uid']
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return db_session
        
    except Exception as e:
        print(f"Error generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/meditations", response_model=List[schemas.MeditationResponse])
async def get_meditations(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        meditations = db.query(models.MeditationSession)\
            .filter(models.MeditationSession.user_id == user['uid'])\
            .order_by(models.MeditationSession.created_at.desc())\
            .all()
        return meditations
    except Exception as e:
        print(f"Error fetching meditations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch meditation history")

@app.get("/api/meditations/{meditation_id}", response_model=schemas.MeditationResponse)
async def get_meditation_by_id(
    meditation_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        meditation = db.query(models.MeditationSession)\
            .filter(models.MeditationSession.id == meditation_id)\
            .filter(models.MeditationSession.user_id == user['uid'])\
            .first()
            
        if not meditation:
            raise HTTPException(status_code=404, detail="Meditation session not found")
            
        return meditation
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error fetching meditation {meditation_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch meditation details")

@app.get("/api/random-quote")
async def get_random_quote():
    if not genai_configured:
        raise HTTPException(
            status_code=500,
            detail="Google API key not configured."
        )
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Tell me a random inspirational quote")
        
        return {
            "success": True,
            "message": "Random quote generated successfully",
            "data": {
                "quote": response.text,
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating quote: {str(e)}"
        )

    