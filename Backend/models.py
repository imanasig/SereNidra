from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base

class MeditationSession(Base):
    __tablename__ = "meditation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)
    duration = Column(Integer)
    preferences = Column(String, nullable=True)
    tone = Column(String, nullable=True)
    script = Column(Text)
    user_id = Column(String, index=True)
    voice_gender = Column(String, default="female") # New field
    audio_script = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)
    voice_used = Column(String, nullable=True)
    audio_generated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
