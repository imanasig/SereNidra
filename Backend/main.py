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


from typing import List, Optional
from sqlalchemy import or_

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
            tone=request.tone
        )
        
        # Save to Database
        db_session = models.MeditationSession(
            type=request.type,
            duration=request.duration,
            preferences=request.preferences,
            tone=request.tone,
            voice_gender=request.voice_gender,
            script=generated_content['visual_script'],
            audio_script=generated_content['audio_script'],
            user_id=user['uid']
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
        
# Audio Generation Integration
# Removed backend-based TTS in favor of Frontend Web Speech API
# No endpoints required.

    