from .db import db
from datetime import datetime
import pytz

def ist_now():
    """Return current time in IST"""
    ist_tz = pytz.timezone('Asia/Kolkata')
    return datetime.now(ist_tz)

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    alert_type = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=ist_now)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    frame_path = db.Column(db.String(255))
    male_count = db.Column(db.Integer)
    female_count = db.Column(db.Integer)
    gesture = db.Column(db.String(50), nullable=True)
    confidence = db.Column(db.Float, nullable=True)

    def to_dict(self):
        # Format timestamp for IST display
        formatted_timestamp = self.timestamp.isoformat() if self.timestamp else None
        return {
            "id": self.id,
            "alert_type": self.alert_type,
            "timestamp": formatted_timestamp,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "frame_path": self.frame_path,
            "male_count": self.male_count,
            "female_count": self.female_count,
            "gesture": self.gesture,
            "confidence": self.confidence
        }
    

class DetectionConfig:
    def __init__(self, confidence_threshold=0.5, gesture_enabled=True, alert_cooldown=5, night_start_hour=20, night_end_hour=6, gesture_thresholds = {
                'thumb_palm': 0.1,
                'wave': 0.25,
                'thumb_folded': 0.1
            }):
        self.confidence_threshold = confidence_threshold
        self.gesture_enabled = gesture_enabled
        self.alert_cooldown = alert_cooldown
        self.night_start_hour = night_start_hour
        self.night_end_hour = night_end_hour
        self.gesture_thresholds = gesture_thresholds
        