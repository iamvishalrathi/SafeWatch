"""
Database Migration Script - Add Camera Model Field to Alert Table
Run this script to add camera_model column to existing alerts database
"""

from app import app, db
from safety_detection.models import Alert
from sqlalchemy import text

def migrate_database():
    with app.app_context():
        print("Starting database migration to add camera_model field...")
        
        try:
            # Check if column already exists
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('alert')]
            
            # Use connection context manager for executing SQL
            with db.engine.connect() as connection:
                # Add camera_model column if it doesn't exist
                if 'camera_model' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_model VARCHAR(100)'))
                    connection.commit()
                    print("✓ Added camera_model column")
                else:
                    print("⚠️  camera_model column already exists")
            
            print("\n✅ Database migration completed successfully!")
            print("Camera model field has been added to the Alert table.")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {str(e)}")
            print("You may need to check your database configuration.")

if __name__ == '__main__':
    migrate_database()
