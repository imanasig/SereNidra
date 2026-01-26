from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MeditationRequest(BaseModel):
    type: str
    duration: int
    preferences: Optional[str] = None
    tone: Optional[str] = None

class MeditationResponse(BaseModel):
    id: int
    type: str
    duration: int
    preferences: Optional[str]
    tone: Optional[str]
    script: str
    created_at: datetime
    
    class Config:
        from_attributes = True
