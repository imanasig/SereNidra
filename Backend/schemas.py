from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeditationRequest(BaseModel):
    type: str
    duration: int
    preferences: Optional[str] = None
    tone: Optional[str] = None
    voice_gender: Optional[str] = "female" # New field

class MeditationResponse(BaseModel):
    id: int
    type: str
    duration: int
    preferences: Optional[str]
    tone: Optional[str]
    voice_gender: Optional[str] # New field
    script: str
    audio_script: Optional[str] = None
    audio_url: Optional[str] = None
    voice_used: Optional[str] = None
    audio_generated_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
