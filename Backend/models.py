from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base

class User(Base):
    __tablename__ = "users"

    uid = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), onupdate=func.now())

class MeditationSession(Base):
    __tablename__ = "meditation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True) # New field for AI generated title
    type = Column(String, index=True)
    duration = Column(Integer)
    preferences = Column(String, nullable=True)
    tone = Column(String, nullable=True)
    script = Column(Text)
    # Using String for foreign key to match User.uid type
    user_id = Column(String, index=True) 
    voice_gender = Column(String, default="female") 
    audio_script = Column(Text, nullable=True)
    audio_url = Column(String, nullable=True)
    voice_used = Column(String, nullable=True)
    audio_generated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # New Fields for Feature 1 & 2
    health_conditions = Column(Text, nullable=True) # JSON serialized list
    mood_before = Column(String, nullable=True)
    mood_after = Column(String, nullable=True)
    improvement_score = Column(Integer, nullable=True)
