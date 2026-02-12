import sqlite3
import os

DB_FILE = "meditations.db"

def migrate():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} does not exist. No migration needed.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(meditation_sessions)")
        columns = [info[1] for info in cursor.fetchall()]
        
        new_columns = {
            "audio_url": "TEXT",
            "voice_used": "TEXT", 
            "audio_generated_at": "DATETIME",
            "audio_script": "TEXT",
            "voice_gender": "TEXT",
            "title": "TEXT" # New
        }

        for col, dtype in new_columns.items():
            if col not in columns:
                print(f"Adding column {col}...")
                cursor.execute(f"ALTER TABLE meditation_sessions ADD COLUMN {col} {dtype}")
                print(f"Column {col} added.")
            else:
                print(f"Column {col} already exists.")

        conn.commit()
        print("Migration completed successfully.")

    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
