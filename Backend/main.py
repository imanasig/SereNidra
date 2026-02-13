import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uuid
import shutil

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import schemas
from services.llm_service import generate_meditation_script, analyze_mood
from services.tts_service import generate_audio
from auth import get_current_user

# Load environment variables from .env file
load_dotenv()

# Initialize Database Models
models.Base.metadata.create_all(bind=engine)

# Initialize Google GenAI Client
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Warning: GOOGLE_API_KEY not found in environment variables.")
    genai_client = None
else:
    from google import genai
    genai_client = genai.Client(api_key=api_key)

app = FastAPI(title="Sleep Meditation Generator API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://serenidra.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {"message": "Sleep Meditation Generator Backend Running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


from typing import List, Optional
from sqlalchemy import or_, func

@app.post("/api/mood/suggest", response_model=schemas.MoodResponse)
async def suggest_from_mood(
    request: schemas.MoodRequest,
    user: dict = Depends(get_current_user)
):
    try:
        suggestion = analyze_mood(request.mood_text)
        return suggestion
    except Exception as e:
        print(f"Error analyzing mood: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze mood")

@app.post("/api/meditations/generate", response_model=schemas.MeditationResponse)
async def generate_meditation(
    request: schemas.MeditationRequest, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        # Generate script using LangChain/Gemini
        generated_content = generate_meditation_script(
            type=request.type,
            duration=request.duration,
            preferences=request.preferences,
            tone=request.tone,
            health_conditions=request.health_conditions,
            mood_before=request.mood_before
        )
        
        # Save to Database
        db_session = models.MeditationSession(
            type=request.type,
            duration=request.duration,
            preferences=request.preferences,
            tone=request.tone,
            voice_gender=request.voice_gender,
            title=generated_content.get('title', 'Untitled Session'),
            script=generated_content['visual_script'],
            audio_script=generated_content['audio_script'],
            user_id=user['uid'],
            health_conditions=",".join(request.health_conditions) if request.health_conditions else None,
            mood_before=request.mood_before
        )
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return db_session
        
    except Exception as e:
        print(f"Error generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/meditations/search", response_model=List[schemas.MeditationSearchResponse])
async def search_meditations(
    query: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        db_query = db.query(models.MeditationSession).filter(models.MeditationSession.user_id == user['uid'])
        
        # Apply filters first to narrow down results
        if query:
            search_pattern = f"%{query}%"
            # Search in script, audio_script, and type
            db_query = db_query.filter(
                or_(
                    models.MeditationSession.script.ilike(search_pattern),
                    models.MeditationSession.audio_script.ilike(search_pattern),
                    models.MeditationSession.type.ilike(search_pattern)
                )
            )
            
        if type:
            db_query = db_query.filter(models.MeditationSession.type == type)
            
        results = db_query.order_by(models.MeditationSession.created_at.desc()).all()
        
        # Format response with match info
        formatted_results = []
        for session in results:
            match_source = "none"
            snippet = None
            
            if query:
                lower_query = query.lower()
                # Check script match
                if session.script and lower_query in session.script.lower():
                    match_source = "script"
                    # Create snippet
                    try:
                        idx = session.script.lower().find(lower_query)
                        start = max(0, idx - 40)
                        end = min(len(session.script), idx + len(query) + 40)
                        snippet = "..." + session.script[start:end] + "..."
                    except:
                        snippet = session.script[:100] + "..."
                
                # Check audio script match (priority lower than visual script)
                elif session.audio_script and lower_query in session.audio_script.lower():
                     match_source = "audio_script"
                     try:
                        idx = session.audio_script.lower().find(lower_query)
                        start = max(0, idx - 40)
                        end = min(len(session.audio_script), idx + len(query) + 40)
                        snippet = "..." + session.audio_script[start:end] + "..."
                     except:
                        pass

                # Check type match
                elif session.type and lower_query in session.type.lower():
                    match_source = "type"
            
            # If no query but filtering by type (or just listing), we can say match is none or filter
            if not query and type:
                 match_source = "filter"

            formatted_results.append({
                "session": session,
                "match_info": {
                    "matched_in": match_source,
                    "snippet": snippet
                }
            })
            
        return formatted_results
        
    except Exception as e:
        print(f"Error searching meditations: {e}")
        raise HTTPException(status_code=500, detail="Failed to search meditations")

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
@app.delete("/api/meditations/{meditation_id}")
async def delete_meditation(
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
            raise HTTPException(status_code=404, detail="Meditation session not found or unauthorized")
            
        db.delete(meditation)
        db.commit()
        
        return {"message": "Session deleted successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error deleting meditation {meditation_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

@app.get("/api/random-quote")
async def get_random_quote():
    if not genai_client:
        raise HTTPException(
            status_code=500,
            detail="Google API key not configured."
        )
    
    try:
        response = genai_client.models.generate_content(
            model='gemini-2.5-flash', 
            contents="Tell me a random inspirational quote"
        )
        
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
        
# Audio Generation Integration
class AudioRequest(schemas.BaseModel):
    voice_gender: str = "Female"

@app.post("/api/meditations/{meditation_id}/audio")
async def generate_meditation_audio(
    meditation_id: int,
    request: AudioRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        # Fetch meditation
        session = db.query(models.MeditationSession)\
            .filter(models.MeditationSession.id == meditation_id)\
            .filter(models.MeditationSession.user_id == user['uid'])\
            .first()
            
        if not session:
            raise HTTPException(status_code=404, detail="Meditation not found")
            
        if not session.audio_script:
            raise HTTPException(status_code=400, detail="No audio script available for this session")
            
        # Generate Audio
        audio_url, duration_seconds = await generate_audio(session.audio_script, voice_gender=request.voice_gender)
        
        # Calculate minutes (round to nearest minute, min 1)
        duration_minutes = max(1, round(duration_seconds / 60))
        
        # Update DB
        session.audio_url = audio_url
        session.duration = duration_minutes # Update to actual generated length
        session.voice_used = request.voice_gender
        session.audio_generated_at = func.now()
        
        db.commit()
        db.refresh(session)
        
        return {"audio_url": audio_url}
        
    except Exception as e:
        print(f"Error generating audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/meditations/{meditation_id}/mood-after", response_model=schemas.MeditationResponse)
async def update_mood_after(
    meditation_id: int,
    request: schemas.MoodAfterRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    try:
        session = db.query(models.MeditationSession)\
            .filter(models.MeditationSession.id == meditation_id)\
            .filter(models.MeditationSession.user_id == user['uid'])\
            .first()
            
        if not session:
            raise HTTPException(status_code=404, detail="Meditation not found")
            
        session.mood_after = request.mood_after
        
        # Calculate improvement score
        mood_scores = {
            "Very anxious": 9, "Overthinking": 8, "Burned out": 8,
            "Sad": 7, "Frustrated": 7, "Restless": 6, "Low energy": 6,
            "Slightly stressed": 5, "Distracted": 5, "Tired": 4,
            "Calm": 2, "Peaceful": 1, "Hopeful": 2, "Numb": 3, "Angry": 7
        }
        
        before_score = mood_scores.get(session.mood_before, 5)
        after_score = mood_scores.get(session.mood_after, 5)
        
        session.improvement_score = before_score - after_score
        
        db.commit()
        db.refresh(session)
        
        return session
    except Exception as e:
        print(f"Error updating mood after: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
