# SheSafe - API & Functionality Documentation

> **Version**: 1.0.0  
> **Last Updated**: October 9, 2025  
> **Backend**: Flask (Python 3.11.9)  
> **Frontend**: React 18.3+ with Vite  

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Backend API Endpoints](#backend-api-endpoints)
3. [Frontend Functionalities](#frontend-functionalities)
4. [AI Detection Features](#ai-detection-features)
5. [Database Schema](#database-schema)
6. [Configuration Options](#configuration-options)
7. [Integration Examples](#integration-examples)

---

## System Overview

**SheSafe** is an AI-powered women's safety monitoring system that uses computer vision and machine learning to detect potential safety threats in real-time.

### Tech Stack
- **Backend**: Flask, OpenCV, MediaPipe, SQLAlchemy
- **Frontend**: React, Vite, Leaflet, Chart.js, GSAP
- **Database**: SQLite
- **AI Models**: Caffe DNN (Gender Detection), Haar Cascade (Face Detection), MediaPipe (Gesture Recognition)

### Core Capabilities
- Real-time video monitoring with AI analysis
- Gender detection and counting
- Distress gesture recognition
- Night-time safety alerts
- Spatial risk assessment (woman surrounded by men)
- Geographic location tracking
- Alert management and visualization

---

## Backend API Endpoints

### Base URL
```
http://localhost:5000
```

### CORS Configuration
- **Enabled**: Yes
- **Access-Control-Allow-Origin**: `*`
- **Supported Methods**: GET

---

### 1. Video Feed Endpoint

#### `GET /video_feed`

**Description**: Streams live video feed from camera with real-time AI processing overlay.

**Response Type**: `multipart/x-mixed-replace; boundary=frame` (MJPEG Stream)

**Features**:
- Real-time gender detection with bounding boxes
- Gender labels overlaid on detected faces
- Gesture detection visualization
- Continuous frame-by-frame processing

**Usage**:
```html
<img src="http://localhost:5000/video_feed" alt="Live Feed" />
```

**Processing Pipeline**:
1. Captures frame from webcam (cv2.VideoCapture)
2. Processes through SafetyDetector
3. Applies gender detection
4. Detects hand gestures
5. Evaluates safety conditions
6. Returns annotated frame

**Performance**:
- Frame Rate: ~30 FPS (depends on hardware)
- Resolution: Camera default (typically 640x480 or 1280x720)

---

### 2. Get Alerts Endpoint

#### `GET /alerts`

**Description**: Retrieves the 10 most recent safety alerts from the database.

**Response Type**: `application/json`

**Response Schema**:
```json
[
  {
    "id": 30,
    "alert_type": "distress",
    "gesture": "closed_fist",
    "timestamp": "2025-10-09T15:55:04.939620",
    "latitude": 28.7501,
    "longitude": 77.1135,
    "frame_path": "alert_frames\\alert_20251009_155504_939620.jpg",
    "confidence": null,
    "female_count": 0,
    "male_count": 1
  }
]
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Unique alert identifier |
| `alert_type` | String | Type of alert (see Alert Types below) |
| `gesture` | String | Detected gesture (if applicable) |
| `timestamp` | ISO 8601 String | When the alert was triggered |
| `latitude` | Float | Geographic latitude |
| `longitude` | Float | Geographic longitude |
| `frame_path` | String | Path to saved alert image |
| `confidence` | Float/Null | Detection confidence score |
| `female_count` | Integer | Number of females detected |
| `male_count` | Integer | Number of males detected |

**Alert Types**:
- `distress` - Distress gesture detected
- `lone_woman_night` - Woman alone at night
- `woman_surrounded` - Woman with 2+ men at night
- `woman_surrounded_spatial` - Woman spatially surrounded by men

**Query Limits**:
- Returns maximum 10 most recent alerts
- Ordered by timestamp (descending)

**Example Request**:
```bash
curl http://localhost:5000/alerts
```

**Example Response**:
```json
[
  {
    "id": 30,
    "alert_type": "distress",
    "gesture": "closed_fist",
    "timestamp": "2025-10-09T15:55:04.939620",
    "latitude": 28.7501,
    "longitude": 77.1135,
    "frame_path": "alert_frames\\alert_20251009_155504_939620.jpg",
    "confidence": null,
    "female_count": 0,
    "male_count": 1
  },
  {
    "id": 29,
    "alert_type": "lone_woman_night",
    "gesture": null,
    "timestamp": "2025-10-09T02:30:15.123456",
    "latitude": 28.7501,
    "longitude": 77.1135,
    "frame_path": "alert_frames\\alert_20251009_023015_123456.jpg",
    "confidence": 0.92,
    "female_count": 1,
    "male_count": 0
  }
]
```

---

### 3. Gender Count Endpoint

#### `GET /gender_count`

**Description**: Returns real-time count of males and females currently detected in the video feed.

**Response Type**: `application/json`

**Response Schema**:
```json
{
  "male": 1,
  "female": 0
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `male` | Integer | Number of males currently detected |
| `female` | Integer | Number of females currently detected |

**Update Frequency**: Updates with each processed frame (~30 times per second)

**Example Request**:
```bash
curl http://localhost:5000/gender_count
```

**Example Response**:
```json
{
  "male": 2,
  "female": 1
}
```

**Use Cases**:
- Real-time dashboard monitoring
- Gender distribution analytics
- Crowd composition analysis
- Safety risk assessment

---

### 4. Alert Image Endpoint

#### `GET /alert_image/<int:alert_id>`

**Description**: Retrieves the saved frame image for a specific alert.

**URL Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | Integer | Yes | The unique ID of the alert |

**Response Type**: `image/jpeg`

**Success Response** (200 OK):
- Returns JPEG image file
- Content-Type: `image/jpeg`

**Error Response** (404 Not Found):
```json
{
  "error": "Image not found"
}
```

**Example Request**:
```bash
curl http://localhost:5000/alert_image/30 --output alert_30.jpg
```

**Frontend Usage**:
```jsx
<img src={`http://localhost:5000/alert_image/${alertId}`} alt="Alert Frame" />
```

**File Storage**:
- Location: `alert_frames/` directory
- Naming: `alert_YYYYMMDD_HHMMSS_microseconds.jpg`
- Format: JPEG with 95% quality

---

## Frontend Functionalities

### Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with project overview |
| `/signin` | Signin | User authentication (login) |
| `/signup` | Signup | User registration |
| `/live` | Live | Real-time monitoring dashboard |
| `/event` | Event | Event management |
| `/contact` | Contact | Contact information and form |

---

### 1. Live Monitoring Dashboard (`/live`)

**Location**: `frontend/src/pages/Live.jsx`

#### Features:

##### A. Real-Time Video Feed
- **Component**: `VideoFeed`
- **Source**: Backend `/video_feed` endpoint
- **Display**: 664x450px with border radius
- **Update**: Live streaming (continuous)

##### B. Gender Distribution
- **Component**: `Piegraph`
- **Data Source**: `/gender_count` endpoint
- **Update Frequency**: Every 1 second
- **Visualization**: Pie chart showing male/female ratio
- **Total Count**: Displays sum of males and females

##### C. Interactive Safety Map
- **Component**: `HotspotMap`
- **Library**: React Leaflet
- **Data Source**: `/alerts` endpoint
- **Update Frequency**: Every 1 second
- **Features**:
  - Red circles marking alert locations
  - Popup information on click (alert type, timestamp, gesture)
  - 50-meter radius danger zones
  - ArcGIS tile layer for map rendering
  - Centered on Delhi (28.6139°N, 77.209°E)

##### D. Alert Screenshots Gallery
- **Display**: Scrollable gallery of alert images
- **Actions**:
  - Delete screenshot
  - Download screenshot
- **Auto-scroll**: Scrolls to newest screenshot

#### API Integration:

```javascript
// Gender count polling (1 second interval)
useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:5000/gender_count")
      .then((res) => res.json())
      .then((data) => setGenderCounts(data));
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Alerts polling (1 second interval)
useEffect(() => {
  const interval = setInterval(() => {
    fetch("http://localhost:5000/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data));
  }, 1000);
  return () => clearInterval(interval);
}, []);
```

---

### 2. Home Page (`/`)

**Location**: `frontend/src/pages/Home.jsx`

**Features**:
- Project introduction and mission statement
- Key features showcase
- Technology overview
- Call-to-action buttons
- Animated elements (GSAP)

---

### 3. Authentication Pages

#### Sign In (`/signin`)
**Location**: `frontend/src/pages/Signin.jsx`
- User login form
- Email/password authentication
- Remember me functionality
- Redirect to dashboard on success

#### Sign Up (`/signup`)
**Location**: `frontend/src/pages/Signup.jsx`
- User registration form
- Form validation
- Password strength requirements
- Email verification (optional)

---

### 4. Contact Page (`/contact`)

**Location**: `frontend/src/pages/Contact.jsx`

**Features**:
- Contact form
- Email integration
- Support inquiries
- Feedback submission

---

### 5. Event Management (`/event`)

**Location**: `frontend/src/pages/Event.jsx`

**Features**:
- Safety event tracking
- Incident reporting
- Event timeline
- Location-based event filtering

---

## Frontend Components

### Core Components

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `components/Navbar.jsx` | Navigation menu with routing |
| `Footer` | `components/Footer.jsx` | Footer with links and info |
| `VideoFeed` | `components/VideoFeed.jsx` | Live camera stream display |
| `HotspotMap` | `components/HotspotMap.jsx` | Interactive Leaflet map with alerts |
| `Piegraph` | `components/Piegraph.jsx` | Gender distribution chart |
| `HeatmapLayer` | `components/HeatmapLayer.jsx` | Heat map overlay for risk zones |
| `RippleButton` | `components/RippleButton.jsx` | Animated button component |
| `Image` | `components/Image.jsx` | Optimized image component |

---

## AI Detection Features

### 1. Gender Detection

**Technology**: Caffe Deep Neural Network

**Model Files**:
- `gender_deploy.prototxt` - Network architecture
- `gender_net.caffemodel` - Pre-trained weights

**Process**:
1. Detect faces using Haar Cascade
2. Extract face ROI (Region of Interest)
3. Preprocess: Resize to 227x227, mean subtraction
4. Forward pass through Caffe DNN
5. Classify as Male or Female
6. Return confidence score

**Accuracy**: ~90-95% under good lighting conditions

**Visualization**:
- Green bounding box: Female
- Blue bounding box: Male
- Label with confidence percentage

---

### 2. Gesture Recognition

**Technology**: MediaPipe Hands

**Detected Gestures**:

#### A. Closed Fist (Distress Signal)
- **Trigger**: All fingers curled into palm
- **Alert**: Immediate distress alert
- **Use Case**: Silent SOS signal

#### B. Thumb-Palm Distance (Help Signal)
- **Trigger**: Thumb touching or very close to palm
- **Threshold**: < 0.08 units
- **Alert**: Distress gesture detected
- **Use Case**: Covert help signal

#### C. Wave Gesture (Attention Signal)
- **Trigger**: Hand waving motion
- **Threshold**: > 0.3 units movement
- **Alert**: Attention-seeking behavior
- **Use Case**: Flagging down help

#### D. Thumb Folded (Concealed Distress)
- **Trigger**: Thumb folded into fist
- **Threshold**: < 0.12 units from palm
- **Alert**: Hidden distress signal
- **Use Case**: Discrete SOS

**Processing**:
```python
gesture_thresholds = {
    'thumb_palm': 0.08,
    'wave': 0.3,
    'thumb_folded': 0.12
}
```

**Hand Landmarks Used**:
- Thumb tip, MCP, IP
- Index finger tip, MCP
- Wrist
- Palm center

---

### 3. Safety Scenario Detection

#### Scenario A: Lone Woman at Night
**Conditions**:
- Time: Between 8 PM and 6 AM (configurable)
- Female count: 1
- Male count: 0

**Alert Type**: `lone_woman_night`

**Risk Level**: Medium

---

#### Scenario B: Woman Surrounded (Numerical)
**Conditions**:
- Time: Night hours
- Female count: 1
- Male count: ≥ 2

**Alert Type**: `woman_surrounded`

**Risk Level**: High

---

#### Scenario C: Woman Surrounded (Spatial)
**Conditions**:
- Time: Night hours
- Female count: 1
- Male count: ≥ 1
- Spatial condition: Males within 150-pixel proximity

**Alert Type**: `woman_surrounded_spatial`

**Risk Level**: High

**Spatial Analysis**:
```python
def _is_surrounded(self, frame):
    # Calculate woman's bounding box center
    # Check if males are within proximity threshold (150px)
    # Consider multiple males surrounding from different angles
    # Return True if surrounded condition met
```

---

#### Scenario D: Distress Gesture
**Conditions**:
- Any time of day
- Distress gesture detected (closed fist, thumb signals, etc.)

**Alert Type**: `distress`

**Risk Level**: Critical

**Priority**: Highest (overrides other conditions)

---

### 4. Alert Cooldown Mechanism

**Purpose**: Prevent alert spam and false positives

**Default Cooldown**: 10 seconds

**Behavior**:
- After alert triggered, system waits 10 seconds before next alert
- Prevents duplicate alerts for same scenario
- Configurable per deployment

**Configuration**:
```python
config = DetectionConfig(
    alert_cooldown=10  # seconds
)
```

---

## Database Schema

### Alert Table

**Table Name**: `alerts`

**ORM**: SQLAlchemy

**Schema**:

```python
class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    alert_type = db.Column(db.String(50), nullable=False)
    gesture = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    frame_path = db.Column(db.String(255), nullable=True)
    confidence = db.Column(db.Float, nullable=True)
    female_count = db.Column(db.Integer, default=0)
    male_count = db.Column(db.Integer, default=0)
```

**Field Details**:

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | Integer | No | Auto-increment | Primary key |
| `alert_type` | String(50) | No | - | Type of safety alert |
| `gesture` | String(50) | Yes | NULL | Detected gesture (if any) |
| `timestamp` | DateTime | No | Current UTC time | When alert occurred |
| `latitude` | Float | Yes | NULL | Geographic latitude |
| `longitude` | Float | Yes | NULL | Geographic longitude |
| `frame_path` | String(255) | Yes | NULL | Path to saved image |
| `confidence` | Float | Yes | NULL | Detection confidence |
| `female_count` | Integer | No | 0 | Females detected |
| `male_count` | Integer | No | 0 | Males detected |

**Indexes**:
- Primary key on `id`
- Index on `timestamp` (for ordered queries)

**Database File**: `alerts.db` (SQLite)

**Location**: Backend root directory

---

## Configuration Options

### DetectionConfig Class

**Location**: `backend/ModelPython/safety_detection/models.py`

```python
@dataclass
class DetectionConfig:
    alert_cooldown: int = 10          # Seconds between alerts
    night_start_hour: int = 20        # Night starts at 8 PM
    night_end_hour: int = 6           # Night ends at 6 AM
    gesture_thresholds: dict = None   # Gesture detection thresholds
    proximity_threshold: int = 150    # Pixels for spatial analysis
```

**Configuration Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `alert_cooldown` | int | 10 | Seconds to wait between consecutive alerts |
| `night_start_hour` | int | 20 | Hour when night mode begins (24-hour format) |
| `night_end_hour` | int | 6 | Hour when night mode ends (24-hour format) |
| `gesture_thresholds` | dict | See below | Sensitivity thresholds for gestures |
| `proximity_threshold` | int | 150 | Pixel distance for spatial surrounding |

**Default Gesture Thresholds**:
```python
{
    'thumb_palm': 0.08,      # Thumb distance to palm center
    'wave': 0.3,             # Wave motion threshold
    'thumb_folded': 0.12     # Thumb folded detection
}
```

**Custom Configuration Example**:
```python
config = DetectionConfig(
    alert_cooldown=15,
    night_start_hour=22,
    night_end_hour=5,
    gesture_thresholds={
        'thumb_palm': 0.06,
        'wave': 0.4,
        'thumb_folded': 0.10
    }
)
detector = SafetyDetector(config)
```

---

## Integration Examples

### Example 1: Fetching and Displaying Alerts

```javascript
// React Component
import React, { useState, useEffect } from 'react';

function AlertList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch alerts every 5 seconds
    const interval = setInterval(() => {
      fetch('http://localhost:5000/alerts')
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(err => console.error('Error fetching alerts:', err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alert-list">
      {alerts.map(alert => (
        <div key={alert.id} className="alert-card">
          <h3>{alert.alert_type}</h3>
          <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
          <p>Location: {alert.latitude}, {alert.longitude}</p>
          {alert.gesture && <p>Gesture: {alert.gesture}</p>}
          <img 
            src={`http://localhost:5000/alert_image/${alert.id}`}
            alt="Alert frame"
          />
        </div>
      ))}
    </div>
  );
}
```

---

### Example 2: Real-Time Gender Counter

```javascript
// React Component with Live Updates
import React, { useState, useEffect } from 'react';

function GenderCounter() {
  const [counts, setCounts] = useState({ male: 0, female: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/gender_count')
        .then(res => res.json())
        .then(data => setCounts(data));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const total = counts.male + counts.female;

  return (
    <div className="gender-counter">
      <h2>People Detected: {total}</h2>
      <div className="stats">
        <div className="male">
          <span>Males: {counts.male}</span>
          <span>({total ? ((counts.male/total)*100).toFixed(1) : 0}%)</span>
        </div>
        <div className="female">
          <span>Females: {counts.female}</span>
          <span>({total ? ((counts.female/total)*100).toFixed(1) : 0}%)</span>
        </div>
      </div>
    </div>
  );
}
```

---

### Example 3: Map Integration with Alerts

```javascript
// Using React Leaflet
import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';

function SafetyMap({ alerts }) {
  return (
    <MapContainer 
      center={[28.6139, 77.209]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
      />
      
      {alerts.map((alert, index) => (
        alert.latitude && alert.longitude && (
          <Circle
            key={alert.id || index}
            center={[alert.latitude, alert.longitude]}
            radius={50}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}
          >
            <Popup>
              <div>
                <strong>Alert: {alert.alert_type}</strong><br />
                <span>Time: {new Date(alert.timestamp).toLocaleString()}</span><br />
                {alert.gesture && <span>Gesture: {alert.gesture}</span>}
              </div>
            </Popup>
          </Circle>
        )
      ))}
    </MapContainer>
  );
}
```

---

### Example 4: Python Backend Custom Implementation

```python
# Custom Flask app with SheSafe detector
from flask import Flask, Response, jsonify
from flask_cors import CORS
from safety_detection import SafetyDetector, DetectionConfig
import cv2

app = Flask(__name__)
CORS(app)

# Custom configuration
config = DetectionConfig(
    alert_cooldown=15,
    night_start_hour=22,
    night_end_hour=5
)

detector = SafetyDetector(config)

@app.route('/custom_feed')
def custom_feed():
    def generate():
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process with custom logic
            processed_frame, alert = detector.process_frame(frame)
            
            # Log alert if detected
            if alert:
                print(f"ALERT: {alert.alert_type}")
            
            _, buffer = cv2.imencode('.jpg', processed_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + 
                   buffer.tobytes() + b'\r\n')
    
    return Response(generate(), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(port=5001, debug=True)
```

---

## Error Handling

### Backend Error Responses

#### 404 Not Found
```json
{
  "error": "Image not found"
}
```

**Causes**:
- Alert image file doesn't exist
- Invalid alert ID
- File deleted from storage

---

#### 500 Internal Server Error
**Common Causes**:
- Camera not accessible
- Model files missing
- Database connection error
- Corrupted video stream

**Solutions**:
- Check camera permissions
- Verify model files in `models/` directory
- Check database file exists
- Restart Flask server

---

### Frontend Error Handling

```javascript
// Example error handling
fetch('http://localhost:5000/alerts')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => setAlerts(data))
  .catch(err => {
    console.error('Error fetching alerts:', err);
    // Show user-friendly error message
    setErrorMessage('Unable to fetch alerts. Please try again.');
  });
```

---

## Performance Optimization

### Backend Optimizations

1. **Frame Processing**:
   - Process every frame (no skipping by default)
   - Adjust resolution for better performance
   - Use GPU acceleration if available

2. **Database Queries**:
   - Limit to 10 most recent alerts
   - Index on timestamp column
   - Use connection pooling

3. **Alert Cooldown**:
   - Prevents redundant database writes
   - Reduces false positive spam
   - Configurable based on use case

### Frontend Optimizations

1. **Polling Intervals**:
   - Gender count: 1 second
   - Alerts: 1 second
   - Consider websockets for real-time updates

2. **Image Optimization**:
   - Lazy load alert images
   - Use appropriate image sizes
   - Implement caching

3. **Map Rendering**:
   - Limit visible alert markers
   - Use clustering for many alerts
   - Optimize tile loading

---

## Security Considerations

### API Security
- ⚠️ **Current**: CORS allows all origins (`*`)
- ✅ **Recommended**: Restrict to specific frontend domain
- ✅ **Add**: API authentication/authorization
- ✅ **Implement**: Rate limiting

### Data Privacy
- Alert images contain sensitive information
- Implement data retention policies
- Encrypt database in production
- Secure file storage

### Camera Access
- Requires user permission
- Handle permission denials gracefully
- Notify users of camera usage

---

## Deployment Considerations

### Production Checklist

- [ ] Update CORS to specific domain
- [ ] Use production WSGI server (Gunicorn/uWSGI)
- [ ] Enable HTTPS
- [ ] Configure proper logging
- [ ] Set up database backups
- [ ] Implement monitoring/alerting
- [ ] Optimize camera settings
- [ ] Test on target hardware
- [ ] Configure firewall rules
- [ ] Set up CDN for static assets

### Environment Variables

```bash
# Backend
FLASK_ENV=production
DATABASE_URL=sqlite:///production_alerts.db
CAMERA_INDEX=0
ALERT_COOLDOWN=10
NIGHT_START_HOUR=20
NIGHT_END_HOUR=6

# Frontend
VITE_API_BASE_URL=https://api.shesafe.com
VITE_ENV=production
```

---

## Troubleshooting

### Common Issues

#### 1. Video feed not loading
**Symptoms**: Black screen or "ERR_CONNECTION_REFUSED"

**Solutions**:
- Check if backend is running on port 5000
- Verify camera is connected and accessible
- Check camera permissions
- Test with `curl http://localhost:5000/video_feed`

---

#### 2. Gender detection not working
**Symptoms**: No bounding boxes or labels

**Solutions**:
- Ensure model files exist in `backend/ModelPython/safety_detection/models/`
- Check file names: `gender_deploy.prototxt`, `gender_net.caffemodel`
- Verify face detection is working (Haar Cascade)
- Check lighting conditions (better light = better detection)

---

#### 3. Alerts not saving
**Symptoms**: No alerts in database or API returns empty array

**Solutions**:
- Check if `alert_frames/` directory exists
- Verify database file `alerts.db` is created
- Check alert cooldown hasn't prevented new alerts
- Verify trigger conditions are met

---

#### 4. Map not rendering
**Symptoms**: Blank map or "Invalid LatLng" errors

**Solutions**:
- Ensure alerts have `latitude` and `longitude` fields
- Check Leaflet CSS is imported
- Verify internet connection (for tile loading)
- Check browser console for errors

---

## API Rate Limits

**Current**: No rate limiting implemented

**Recommended for Production**:
- `/video_feed`: Limit to 1 connection per user
- `/alerts`: 60 requests per minute
- `/gender_count`: 60 requests per minute
- `/alert_image/<id>`: 120 requests per minute

---

## Changelog

### Version 1.0.0 (October 9, 2025)
- ✅ Initial release
- ✅ Core API endpoints implemented
- ✅ AI detection features operational
- ✅ Frontend integration complete
- ✅ Database schema finalized
- ✅ Documentation created

---

## Support & Contact

For technical support, bug reports, or feature requests:
- **GitHub**: [SheSafe Repository](https://github.com/iamvishalrathi/SheSafe)
- **Email**: support@shesafe.com
- **Documentation**: See README.md files in backend and frontend directories

---

## License

See LICENSE file in project root.

---

**Last Updated**: October 9, 2025  
**Documentation Version**: 1.0.0  
**API Version**: 1.0.0
