from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import MeditationSession, User
from database import Base, engine

# Update Schema
Base.metadata.create_all(bind=engine)

def verify_schema():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Tables in DB:", tables)
    
    if "users" in tables:
        print("✅ 'users' table exists.")
        columns = [c['name'] for c in inspector.get_columns("users")]
        print("   Columns:", columns)
    else:
        print("❌ 'users' table missing!")

    if "meditation_sessions" in tables:
        print("✅ 'meditation_sessions' table exists.")
        columns = [c['name'] for c in inspector.get_columns("meditation_sessions")]
        if "audio_url" in columns and "user_id" in columns:
            print("✅ 'meditation_sessions' has required columns.")
        else:
             print("❌ 'meditation_sessions' missing columns:", columns)
    else:
        print("❌ 'meditation_sessions' table missing!")

def verify_data():
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        # Get the most recent session
        session = db.query(MeditationSession).order_by(MeditationSession.id.desc()).first()
        
        if session:
            print("\nLatest Session Found:")
            print(f"ID: {session.id}")
            print(f"User ID: {session.user_id}")
            print(f"Audio URL: {session.audio_url}")
            print(f"Voice: {session.voice_used}")
        else:
            print("\nNo sessions found in the database yet.")
            
        users = db.query(User).all()
        print(f"\nTotal Users: {len(users)}")
        for u in users:
            print(f"User: {u.uid} ({u.email})")
            
    except Exception as e:
        print(f"Error querying data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_schema()
    verify_data()
