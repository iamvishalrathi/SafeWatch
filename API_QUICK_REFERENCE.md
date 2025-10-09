# SheSafe - Quick API Reference

> Fast reference for developers integrating with SheSafe

---

## 🚀 Quick Start

### Backend
```bash
cd backend/ModelPython
python app.py
```
**URL**: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm run dev
```
**URL**: `http://localhost:5173`

---

## 📡 API Endpoints Summary

| Endpoint | Method | Description | Response Type |
|----------|--------|-------------|---------------|
| `/video_feed` | GET | Live video stream with AI | MJPEG Stream |
| `/alerts` | GET | Get 10 recent alerts | JSON Array |
| `/gender_count` | GET | Real-time gender count | JSON Object |
| `/alert_image/<id>` | GET | Get alert frame image | JPEG Image |

---

## 🔍 API Details

### 1. Video Feed
```
GET /video_feed
```

**Returns**: Live MJPEG stream

**Usage**:
```html
<img src="http://localhost:5000/video_feed" />
```

---

### 2. Get Alerts
```
GET /alerts
```

**Response**:
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

**Alert Types**:
- `distress` - Distress gesture detected
- `lone_woman_night` - Woman alone at night
- `woman_surrounded` - Woman with 2+ men
- `woman_surrounded_spatial` - Spatial proximity alert

---

### 3. Gender Count
```
GET /gender_count
```

**Response**:
```json
{
  "male": 1,
  "female": 0
}
```

**Update**: Every frame (~30 FPS)

---

### 4. Alert Image
```
GET /alert_image/<alert_id>
```

**Example**:
```
GET /alert_image/30
```

**Returns**: JPEG image file

**Error** (404):
```json
{
  "error": "Image not found"
}
```

---

## 🎯 Detected Gestures

| Gesture | Trigger | Alert Type |
|---------|---------|------------|
| Closed Fist | All fingers curled | `distress` |
| Thumb-Palm | Thumb < 0.08 from palm | `distress` |
| Thumb Folded | Thumb < 0.12 inside fist | `distress` |
| Wave | Movement > 0.3 units | `distress` |

---

## 🌙 Night Mode Alerts

**Active**: 8 PM - 6 AM (configurable)

| Scenario | Condition | Alert |
|----------|-----------|-------|
| Lone Woman | 1 female, 0 males | `lone_woman_night` |
| Surrounded (Numerical) | 1 female, 2+ males | `woman_surrounded` |
| Surrounded (Spatial) | 1 female, males within 150px | `woman_surrounded_spatial` |

---

## 🗺️ Frontend Routes

| Route | Page | Function |
|-------|------|----------|
| `/` | Home | Landing page |
| `/signin` | Sign In | User login |
| `/signup` | Sign Up | Registration |
| `/live` | Live Dashboard | Real-time monitoring |
| `/event` | Events | Event management |
| `/contact` | Contact | Contact form |

---

## 🔧 Configuration

```python
config = DetectionConfig(
    alert_cooldown=10,        # Seconds between alerts
    night_start_hour=20,      # 8 PM
    night_end_hour=6,         # 6 AM
    gesture_thresholds={
        'thumb_palm': 0.08,
        'wave': 0.3,
        'thumb_folded': 0.12
    }
)
```

---

## 💾 Database Schema

**Table**: `alerts`

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Primary key |
| `alert_type` | String | Alert category |
| `gesture` | String | Detected gesture |
| `timestamp` | DateTime | When triggered |
| `latitude` | Float | GPS latitude |
| `longitude` | Float | GPS longitude |
| `frame_path` | String | Image path |
| `confidence` | Float | Detection score |
| `female_count` | Integer | Females detected |
| `male_count` | Integer | Males detected |

---

## 🎨 React Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `VideoFeed` | Display live stream | None |
| `HotspotMap` | Show alerts on map | `Alerts` (array) |
| `Piegraph` | Gender distribution | `data` (object) |
| `Navbar` | Navigation | None |
| `Footer` | Footer info | None |

---

## 📊 Integration Example

```javascript
// Fetch alerts with auto-refresh
useEffect(() => {
  const fetchAlerts = async () => {
    try {
      const res = await fetch('http://localhost:5000/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchAlerts();
  const interval = setInterval(fetchAlerts, 5000); // Every 5 sec
  
  return () => clearInterval(interval);
}, []);
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Video not loading | Check backend running, camera connected |
| No alerts | Verify trigger conditions, check cooldown |
| Map blank | Ensure Leaflet CSS imported, check lat/lng |
| CORS error | Backend has CORS enabled, check URL |

---

## 🔐 Security Notes

- ⚠️ CORS currently allows all origins (`*`)
- 🔒 Add authentication for production
- 🛡️ Implement rate limiting
- 🔑 Secure camera access
- 📁 Encrypt sensitive data

---

## 📞 Testing Endpoints

```bash
# Test alerts
curl http://localhost:5000/alerts

# Test gender count
curl http://localhost:5000/gender_count

# Download alert image
curl http://localhost:5000/alert_image/30 -o alert.jpg

# Test video feed (will stream)
curl http://localhost:5000/video_feed
```

---

## 📦 Tech Stack

**Backend**:
- Flask 2.0+
- OpenCV 4.8+
- MediaPipe
- SQLAlchemy
- Caffe (Gender Detection)

**Frontend**:
- React 18.3+
- Vite 5.4+
- Leaflet (Maps)
- Chart.js
- GSAP (Animations)

**AI Models**:
- Gender: Caffe DNN
- Face: Haar Cascade
- Gestures: MediaPipe Hands

---

## ⚡ Performance Tips

1. **Backend**:
   - Use GPU for OpenCV if available
   - Adjust camera resolution
   - Optimize frame processing

2. **Frontend**:
   - Use proper polling intervals
   - Implement caching
   - Lazy load images

3. **Database**:
   - Index timestamp column
   - Regular cleanup of old alerts
   - Use connection pooling

---

## 📝 Next Steps

1. Add user authentication
2. Implement websockets for real-time updates
3. Add email/SMS notifications
4. Create admin dashboard
5. Implement data analytics
6. Add export functionality

---

**For complete documentation, see**: `API_DOCUMENTATION.md`

**Last Updated**: October 9, 2025
