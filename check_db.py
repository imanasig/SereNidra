from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Backend.models import MeditationSession
from Backend.database import Base

# Setup DB
# Assuming running from root or Backend, let's try to be robust or just point incorrectly.
# Since we run from Backend dir via uv run, the path 'Backend/meditations.db' is wrong relative to Backend dir.
# It should be just 'meditations.db' if we are in Backend.
SQLALCHEMY_DATABASE_URL = "sqlite:///meditations.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def verify_session():
    db = SessionLocal()
    try:
        # Get the most recent session
        session = db.query(MeditationSession).order_by(MeditationSession.id.desc()).first()
        
        if session:
            print("Session Found:")
            print(f"ID: {session.id}")
            print(f"Type: {session.type}")
            print(f"Duration: {session.duration}")
            print(f"User ID: {session.user_id}")
            print(f"Tone: {session.tone}")
            print(f"Script Preview: {session.script[:50]}...")
        else:
            print("No sessions found in the database.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_session()
