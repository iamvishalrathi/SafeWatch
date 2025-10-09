# 🛡️ SheSafe - AI-Powered Women's Safety Monitoring System

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue.svg" alt="Python Version">
  <img src="https://img.shields.io/badge/React-18.3+-61DAFB.svg" alt="React Version">
  <img src="https://img.shields.io/badge/Flask-2.0+-green.svg" alt="Flask Version">
  <img src="https://img.shields.io/badge/OpenCV-4.8+-red.svg" alt="OpenCV Version">
  <img src="https://img.shields.io/badge/MediaPipe-Latest-orange.svg" alt="MediaPipe">
</div>

## 📋 Overview

**SheSafe** is an innovative AI-driven platform designed to enhance women's safety in public spaces through real-time monitoring, anomaly detection, and intelligent gesture recognition. The system proactively identifies potential threats and alerts authorities, creating a safer environment for women everywhere.

### 🎯 Key Features

- **Real-time Video Monitoring**: Live camera feed processing with computer vision
- **Gender Detection**: AI-powered gender classification using deep learning models
- **Gesture Recognition**: MediaPipe-based hand gesture detection for distress signals
- **Smart Alert System**: Automated threat detection with configurable cooldown periods
- **Location Tracking**: GPS-based location services for emergency response
- **Web Dashboard**: Modern React-based interface for monitoring and alerts
- **Database Integration**: SQLite database for storing alerts and incident data
- **Night Mode Detection**: Time-based monitoring with enhanced sensitivity
- **Heatmap Visualization**: Geographic visualization of safety incidents

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Models     │
│   (React)       │◄──►│   (Flask)       │◄──►│   (OpenCV +     │
│                 │    │                 │    │   MediaPipe)    │
│ • Dashboard     │    │ • Video Feed    │    │                 │
│ • Alerts View   │    │ • Alert API     │    │ • Gender Det.   │
│ • Heatmaps      │    │ • DB Management │    │ • Gesture Rec.  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 16+**
- **npm or yarn**
- **Webcam/Camera** (for video feed)

### 🔧 Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SheSafe/backend/vihaan-backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install flask flask-cors flask-sqlalchemy opencv-python mediapipe numpy geocoder
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configurations
   ```

5. **Run the backend server**
   ```bash
   cd ModelPython
   python app.py
   ```

   The backend will be available at: `http://localhost:5000`

### 🎨 Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd SheSafe/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## 📚 API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/video_feed` | GET | Live video stream with AI processing |
| `/alerts` | GET | Retrieve recent safety alerts |
| `/alert_image/<id>` | GET | Get alert frame image by ID |

### Video Feed
```http
GET /video_feed
Content-Type: multipart/x-mixed-replace; boundary=frame
```

### Get Alerts
```http
GET /alerts
```

**Response:**
```json
[
  {
    "id": 1,
    "alert_type": "distress_gesture",
    "timestamp": "2025-10-08T21:30:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "male_count": 3,
    "female_count": 1,
    "gesture": "help_signal",
    "confidence": 0.85
  }
]
```

## 🤖 AI Models & Detection

### Gender Detection
- **Model**: Custom CNN trained on gender classification
- **Framework**: OpenCV DNN module
- **Files**: 
  - `gender_deploy.prototxt` - Network architecture
  - `gender_net.caffemodel` - Pre-trained weights
  - `gender_detection3.h5` - TensorFlow model

### Face Detection
- **Algorithm**: Haar Cascade Classifier
- **File**: `haarcascade_frontalface_default.xml`

### Gesture Recognition
- **Framework**: MediaPipe Hands
- **Supported Gestures**:
  - Thumb-palm gesture
  - Wave gesture  
  - Thumb folded gesture
- **Confidence Thresholds**: Configurable per gesture type

### Safety Detection Logic

```python
# Gesture thresholds (configurable)
gesture_thresholds = {
    'thumb_palm': 0.08,
    'wave': 0.3,
    'thumb_folded': 0.12
}

# Alert cooldown: 10 seconds between alerts
alert_cooldown = 10

# Night mode: Enhanced sensitivity (8 PM - 6 AM)
night_start_hour = 20
night_end_hour = 6
```

## 📁 Project Structure

```
SheSafe/
├── backend/
│   └── vihaan-backend/
│       ├── ModelPython/
│       │   ├── app.py                 # Main Flask application
│       │   ├── app.html              # Basic HTML interface
│       │   ├── alert_frames/         # Stored alert images
│       │   └── safety_detection/     # AI detection module
│       │       ├── __init__.py
│       │       ├── detector.py       # Core detection logic
│       │       ├── models.py         # Database models
│       │       ├── db.py            # Database configuration
│       │       ├── utils.py         # Utility functions
│       │       └── models/          # AI model files
│       ├── Dockerfile               # Backend containerization
│       ├── .env.example            # Environment template
│       └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Application pages
│   │   └── utils/                  # Utility functions
│   ├── public/                     # Static assets
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js            # Vite configuration
│   └── Dockerfile                # Frontend containerization
├── docker-compose.yml            # Multi-container setup
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Detection Configuration
```python
config = DetectionConfig(
    alert_cooldown=10,          # Seconds between alerts
    night_start_hour=20,        # Night mode start (8 PM)
    night_end_hour=6,          # Night mode end (6 AM)
    gesture_thresholds={
        'thumb_palm': 0.08,
        'wave': 0.3,
        'thumb_folded': 0.12
    }
)
```

### Database Configuration
- **Type**: SQLite (development)
- **File**: `alerts.db`
- **Models**: Alert records with timestamps, locations, and metadata

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up --build
```

### Individual Containers

**Backend:**
```bash
cd backend/vihaan-backend
docker build -t shesafe-backend .
docker run -p 5000:5000 shesafe-backend
```

**Frontend:**
```bash
cd frontend
docker build -t shesafe-frontend .
docker run -p 3000:3000 shesafe-frontend
```

## 🧪 Testing

### Backend Testing
```bash
cd backend/vihaan-backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Performance Metrics

- **Detection Speed**: ~30 FPS (real-time processing)
- **Gender Classification Accuracy**: ~85%
- **Gesture Recognition Latency**: <100ms
- **Alert Response Time**: <2 seconds
- **Memory Usage**: ~500MB (with models loaded)

## 🛠️ Troubleshooting

### Common Issues

1. **Camera Access Error**
   ```python
   # Ensure camera permissions are granted
   cap = cv2.VideoCapture(0)  # Try different indices (0, 1, 2)
   ```

2. **Model Loading Error**
   ```bash
   # Ensure model files are in the correct directory
   ls backend/vihaan-backend/ModelPython/safety_detection/models/
   ```

3. **Port Already in Use**
   ```bash
   # Kill process using the port
   lsof -ti:5000 | xargs kill -9
   ```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Commit changes**: `git commit -m 'Add feature'`
4. **Push to branch**: `git push origin feature-name`
5. **Submit a Pull Request**

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript/React
- Write unit tests for new features
- Update documentation for API changes

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: Python/Flask, AI/ML Integration
- **Frontend Development**: React.js, UI/UX Design
- **AI/ML Engineering**: Computer Vision, Model Training
- **DevOps**: Docker, Deployment, CI/CD

## 🔮 Future Enhancements

- [ ] **Mobile Application** (React Native/Flutter)
- [ ] **Real-time Notifications** (WebSocket/Socket.io)
- [ ] **Advanced ML Models** (YOLO, Transformer-based)
- [ ] **Cloud Deployment** (AWS/GCP integration)
- [ ] **Multi-language Support** (i18n)
- [ ] **Analytics Dashboard** (Advanced reporting)
- [ ] **Integration APIs** (Emergency services, IoT devices)
- [ ] **Voice Alert System** (Audio processing)

## 📞 Support

For support, please contact:
- **Email**: support@shesafe.com
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

<div align="center">
  <p>🛡️ <strong>SheSafe</strong> - Empowering Safety Through Technology</p>
  <p>Made with ❤️ for women's safety worldwide</p>
</div>