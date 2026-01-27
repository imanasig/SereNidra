from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from models import MeditationSession
from database import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

sessions = db.query(MeditationSession).all()
print(f"Total sessions: {len(sessions)}")
for s in sessions:
    print(f"ID: {s.id}, Type: {s.type}, Duration: {s.duration}, Tone: {s.tone}")
    print(f"Script Preview: {s.script[:100]}...")
