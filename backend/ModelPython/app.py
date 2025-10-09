from flask import Flask, Response, jsonify, send_file
from flask_cors import CORS
from flask import current_app
from safety_detection import SafetyDetector, DetectionConfig
from safety_detection.db import db
from safety_detection.models import Alert as DBAlert
import cv2
import os

app = Flask(__name__)
CORS(app)

# Initialize detector with custom config
config = DetectionConfig(
    alert_cooldown=10,  # 10 seconds between alerts
    night_start_hour=20,
    night_end_hour=6,
    gesture_thresholds={
        'thumb_palm': 0.08,
        'wave': 0.3,
        'thumb_folded': 0.12
    }
)
detector = SafetyDetector(config)


# DB config (SQLite for simplicity)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///alerts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables on first run
with app.app_context():
    db.create_all()

# Detector initialization
config = DetectionConfig()
detector = SafetyDetector(config)

@app.route('/video_feed')
def video_feed():
    def generate():
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            else:
                # ensure app context is active
                with app.app_context():
                    processed_frame, alert = detector.process_frame(frame)
            _, buffer = cv2.imencode('.jpg', processed_frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/alerts')
def get_alerts():
    alerts = DBAlert.query.order_by(DBAlert.timestamp.desc()).limit(10).all()
    return jsonify([a.to_dict() for a in alerts])

@app.route('/gender_count')
def get_gender_count():
    """Returns the current gender count from the detector"""
    return jsonify({
        'male': detector.current_counts.get('male', 0),
        'female': detector.current_counts.get('female', 0)
    })

@app.route('/alert_image/<int:alert_id>')
def get_alert_image(alert_id):
    alert = DBAlert.query.get_or_404(alert_id)
    if os.path.exists(alert.frame_path):
        return send_file(alert.frame_path, mimetype='image/jpeg')
    return jsonify({'error': 'Image not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
