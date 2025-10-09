# 🛡️ SheSafe Backend - AI Safety Detection Server

## 📋 Overview

The SheSafe backend is a Flask-based Python server that provides real-time AI-powered safety detection using computer vision and machine learning. It processes video feeds, detects potential threats, and manages safety alerts through a REST API.

## 🔧 Features

- **Real-time Video Processing**: Live camera feed with AI analysis
- **Gender Detection**: Deep learning-based gender classification
- **Gesture Recognition**: MediaPipe hand gesture detection for distress signals
- **Alert Management**: SQLite database for storing and retrieving safety alerts
- **Location Services**: GPS-based location tracking for incidents
- **REST API**: Endpoints for frontend integration

## 📋 Prerequisites

- **Python 3.11 or higher**
- **Webcam/Camera** (for video feed)
- **Windows/macOS/Linux** operating system

## 🚀 Installation & Setup

### 1. Clone or Navigate to Backend Directory

```bash
cd "c:\Users\Vishal\OneDrive\Desktop\Personal\Projects\Group Projects\SheSafe\backend\vihaan-backend"
```

### 2. Create Python Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Required Dependencies

```bash
pip install flask flask-cors flask-sqlalchemy opencv-python mediapipe numpy geocoder
```

**Or install from requirements (if available):**
```bash
pip install -r requirements.txt
```

### 4. Verify Model Files

Ensure these AI model files are present in `ModelPython/safety_detection/models/`:
- `gender_deploy.prototxt`
- `gender_net.caffemodel`
- `gender_detection3.h5`
- `haarcascade_frontalface_default.xml`

### 5. Set Up Environment Variables (Optional)

```bash
cp .env.example .env
```

Edit `.env` file if you need custom configurations:
```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///alerts.db
```

## 🏃‍♂️ Running the Backend

### Start the Flask Server

```bash
cd ModelPython
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Alternative Start Methods

**With specific Python version:**
```bash
python3.11 app.py
```

**With Flask command:**
```bash
export FLASK_APP=app.py  # Linux/macOS
set FLASK_APP=app.py     # Windows
flask run
```

## 🌐 API Endpoints

Once running, the backend provides these endpoints:

| Endpoint | Method | Description | URL |
|----------|--------|-------------|-----|
| Video Feed | GET | Live video stream with AI processing | `http://localhost:5000/video_feed` |
| Get Alerts | GET | Retrieve recent safety alerts | `http://localhost:5000/alerts` |
| Alert Image | GET | Get specific alert frame image | `http://localhost:5000/alert_image/<id>` |

### Testing the API

**Test video feed in browser:**
```
http://localhost:5000/video_feed
```

**Get alerts (JSON):**
```bash
curl http://localhost:5000/alerts
```

**Example alert response:**
```json
[
  {
    "id": 1,
    "alert_type": "distress_gesture",
    "timestamp": "2025-10-09T10:30:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "male_count": 2,
    "female_count": 1,
    "gesture": "help_signal",
    "confidence": 0.87
  }
]
```

## ⚙️ Configuration

### Detection Parameters

Edit `ModelPython/app.py` to modify detection settings:

```python
config = DetectionConfig(
    alert_cooldown=10,          # Seconds between alerts
    night_start_hour=20,        # Night mode start (8 PM)
    night_end_hour=6,          # Night mode end (6 AM)
    gesture_thresholds={
        'thumb_palm': 0.08,     # Gesture sensitivity
        'wave': 0.3,
        'thumb_folded': 0.12
    }
)
```

### Camera Configuration

Change camera source in `app.py`:
```python
# Default camera (usually 0)
cap = cv2.VideoCapture(0)

# External camera (try 1, 2, etc.)
cap = cv2.VideoCapture(1)

# IP camera
cap = cv2.VideoCapture('rtsp://camera-ip:port/stream')
```

## 🗄️ Database

The backend uses SQLite for storing alerts:
- **Database File**: `alerts.db` (auto-created)
- **Tables**: `alert` (stores incident data)
- **Location**: Same directory as `app.py`

### Database Schema

```sql
CREATE TABLE alert (
    id INTEGER PRIMARY KEY,
    alert_type VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude FLOAT,
    longitude FLOAT,
    frame_path VARCHAR(255),
    male_count INTEGER,
    female_count INTEGER,
    gesture VARCHAR(50),
    confidence FLOAT
);
```

## 🐛 Troubleshooting

### Common Issues

**1. Camera not accessible:**
```bash
# Check available cameras
python -c "import cv2; print([cv2.VideoCapture(i).read()[0] for i in range(5)])"
```

**2. Model files not found:**
```
RuntimeError: Failed to load gender detection models
```
**Solution:** Ensure all model files are in `ModelPython/safety_detection/models/`

**3. Port already in use:**
```
OSError: [WinError 10048] Only one usage of each socket address
```
**Solution:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**4. Permission denied (camera):**
- Check camera permissions in system settings
- Try running as administrator
- Ensure no other app is using the camera

**5. Import errors:**
```bash
# Reinstall packages
pip uninstall opencv-python
pip install opencv-python
```

### Debug Mode

Enable detailed logging:
```python
# In app.py
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🔒 Security Notes

- **Local Development Only**: Default configuration is for development
- **Camera Privacy**: Be aware of camera access and data privacy
- **Alert Data**: Alert frames are stored locally in `alert_frames/`
- **Network Access**: Server binds to localhost by default

## 📊 Performance

- **Processing Speed**: ~30 FPS
- **Memory Usage**: ~500MB (with models loaded)
- **CPU Usage**: Depends on camera resolution and detection complexity
- **Storage**: Alert images stored in `alert_frames/` directory

## 🔄 Development

### Project Structure
```
ModelPython/
├── app.py                 # Main Flask application
├── app.html              # Basic web interface
├── alert_frames/         # Generated alert images
└── safety_detection/     # AI detection module
    ├── detector.py       # Core detection logic
    ├── models.py         # Database models
    ├── db.py            # Database setup
    ├── utils.py         # Helper functions
    └── models/          # AI model files
```

### Adding New Features

1. **New Detection Algorithm**: Modify `safety_detection/detector.py`
2. **New API Endpoint**: Add routes in `app.py`
3. **Database Changes**: Update `safety_detection/models.py`

## 📞 Support

For backend-specific issues:
- Check console output for error messages
- Verify camera and model file accessibility
- Test API endpoints individually
- Check database file permissions

---

🛡️ **SheSafe Backend** - Real-time AI Safety Detection Server