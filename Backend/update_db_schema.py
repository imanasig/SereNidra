import sqlite3
import os

DB_FILE = "meditations.db"

def update_db():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found. Skipping migration.")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Define columns to add
    new_columns = [
        ("health_conditions", "TEXT"),
        ("mood_before", "VARCHAR"),
        ("mood_after", "VARCHAR"),
        ("improvement_score", "INTEGER")
    ]

    # Get existing columns
    cursor.execute("PRAGMA table_info(meditation_sessions)")
    existing_columns = [row[1] for row in cursor.fetchall()]

    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            print(f"Adding column {col_name}...")
            try:
                cursor.execute(f"ALTER TABLE meditation_sessions ADD COLUMN {col_name} {col_type}")
                print(f"Successfully added {col_name}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")

    conn.commit()
    conn.close()
    print("Database migration completed.")

if __name__ == "__main__":
    update_db()
