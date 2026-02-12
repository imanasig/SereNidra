from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MeditationRequest(BaseModel):
    type: str
    duration: int
    preferences: Optional[str] = None
    tone: Optional[str] = None
    voice_gender: Optional[str] = "female"
    health_conditions: Optional[List[str]] = None
    mood_before: Optional[str] = None

class MoodRequest(BaseModel):
    mood_text: str

class MoodResponse(BaseModel):
    suggested_type: str
    suggested_duration: int
    suggested_tone: str
    suggested_focus_areas: str

class MeditationResponse(BaseModel):
    id: int
    title: Optional[str] = None
    type: str
    duration: int
    preferences: Optional[str] = None
    tone: Optional[str] = None
    voice_gender: Optional[str] = None
    script: str
    audio_script: Optional[str] = None
    audio_url: Optional[str] = None
    voice_used: Optional[str] = None
    audio_generated_at: Optional[datetime] = None
    created_at: datetime
    
    # New Fields
    health_conditions: Optional[str] = None
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    improvement_score: Optional[int] = None
    
    class Config:
        from_attributes = True

class SearchMatchInfo(BaseModel):
    matched_in: str
    snippet: Optional[str] = None

class MeditationSearchResponse(BaseModel):
    session: MeditationResponse
    match_info: SearchMatchInfo

class MoodAfterRequest(BaseModel):
    mood_after: str

