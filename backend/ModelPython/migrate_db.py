"""
Database migration script to add age_range column to existing alerts table.
Run this if you have an existing database.
"""

import sqlite3
import os

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), 'instance', 'alerts.db')

def migrate_database():
    """Add age_range column to alerts table if it doesn't exist."""
    if not os.path.exists(db_path):
        print("No existing database found. Will be created on first run.")
        return
    
    print(f"Migrating database at: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if age_range column already exists
        cursor.execute("PRAGMA table_info(alert)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'age_range' not in columns:
            print("Adding age_range column...")
            cursor.execute("ALTER TABLE alert ADD COLUMN age_range VARCHAR(20)")
            conn.commit()
            print("✓ Successfully added age_range column")
        else:
            print("✓ age_range column already exists")
        
        conn.close()
        print("✓ Database migration complete!")
        
    except Exception as e:
        print(f"✗ Error during migration: {str(e)}")

if __name__ == "__main__":
    migrate_database()
