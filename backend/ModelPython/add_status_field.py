"""
Migration script to add status field to Alert table
Run this script to update existing database with the new status column
"""

from app import app, db
from safety_detection.models import Alert
from sqlalchemy import text

def add_status_column():
    with app.app_context():
        try:
            # Check if status column already exists
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('alert')]
            
            if 'status' in columns:
                print("Status column already exists. No migration needed.")
                return
            
            # Add status column with default value 'unseen'
            with db.engine.connect() as conn:
                conn.execute(text("ALTER TABLE alert ADD COLUMN status VARCHAR(20) DEFAULT 'unseen' NOT NULL"))
                conn.commit()
            
            print("Successfully added status column to alert table with default value 'unseen'")
            
            # Verify the change
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('alert')]
            print(f"Alert table columns: {columns}")
            
        except Exception as e:
            print(f"Error during migration: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    print("Starting migration to add status field...")
    add_status_column()
    print("Migration completed!")
