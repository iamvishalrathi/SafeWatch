import os
import cv2
import geocoder
from datetime import datetime
import time
from typing import Tuple, Optional
import numpy as np


def get_location() -> Tuple[float, float]:
    """Get current latitude and longitude with fallback"""
    try:
        g = geocoder.ip('me')
        return g.latlng if g.latlng else (0.0, 0.0)
    except Exception:
        return (0.0, 0.0)

def is_nighttime(night_start: int = 20, night_end: int = 6) -> bool:
    """Check if current time is nighttime"""
    current_hour = datetime.now().hour
    return current_hour >= night_start or current_hour < night_end

def save_alert_frame(frame: np.ndarray, folder: str = "alert_frames") -> str:
    """Save alert frame to disk with timestamp"""
    os.makedirs(folder, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
    frame_path = os.path.join(folder, f"alert_{timestamp}.jpg")
    cv2.imwrite(frame_path, frame)
    return frame_path

def encode_frame_to_jpg(frame: np.ndarray) -> bytes:
    """Encode frame as JPEG bytes"""
    success, buffer = cv2.imencode('.jpg', frame)
    if not success:
        raise ValueError("Could not encode frame as JPEG")
    return buffer.tobytes()