"""
Database Migration Script - Add Camera Fields to Alert Table
Run this script to add camera information fields to existing alerts database
"""

from app import app, db
from safety_detection.models import Alert
from sqlalchemy import text

def migrate_database():
    with app.app_context():
        print("Starting database migration...")
        
        try:
            # Check if columns already exist
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('alert')]
            
            # Use connection context manager for executing SQL
            with db.engine.connect() as connection:
                # Add camera_id column if it doesn't exist
                if 'camera_id' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_id INTEGER'))
                    connection.commit()
                    print("✓ Added camera_id column")
                
                # Add camera_name column if it doesn't exist
                if 'camera_name' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_name VARCHAR(100)'))
                    connection.commit()
                    print("✓ Added camera_name column")
                
                # Add camera_location column if it doesn't exist
                if 'camera_location' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_location VARCHAR(100)'))
                    connection.commit()
                    print("✓ Added camera_location column")
                
                # Add camera_latitude column if it doesn't exist
                if 'camera_latitude' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_latitude FLOAT'))
                    connection.commit()
                    print("✓ Added camera_latitude column")
                
                # Add camera_longitude column if it doesn't exist
                if 'camera_longitude' not in columns:
                    connection.execute(text('ALTER TABLE alert ADD COLUMN camera_longitude FLOAT'))
                    connection.commit()
                    print("✓ Added camera_longitude column")
            
            print("\n✅ Database migration completed successfully!")
            print("Camera fields have been added to the Alert table.")
            
        except Exception as e:
            print(f"\n❌ Migration failed: {str(e)}")
            print("You may need to delete the old database and create a new one.")

if __name__ == '__main__':
    migrate_database()
