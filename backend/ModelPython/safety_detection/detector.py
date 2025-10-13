import cv2
import numpy as np
import os
import mediapipe as mp
import time
from datetime import datetime
import pytz
from typing import Tuple, Optional, List
from .models import Alert, DetectionConfig
from .utils import get_location, is_nighttime, save_alert_frame, encode_frame_to_jpg
from .db import db
from .models import Alert as DBAlert

def ist_now():
    """Return current time in IST"""
    ist_tz = pytz.timezone('Asia/Kolkata')
    return datetime.now(ist_tz)


class SafetyDetector:
    # In detector.py, modify the __init__ method to:
    def __init__(self, config: DetectionConfig = None):
        self.config = config if config else DetectionConfig()
        
        # Initialize MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Initialize gender detection with proper path handling
        model_dir = os.path.join(os.path.dirname(__file__), 'models')
        try:
            self.gender_net = cv2.dnn.readNetFromCaffe(
                os.path.join(model_dir, 'gender_deploy.prototxt'),
                os.path.join(model_dir, 'gender_net.caffemodel')
            )
        except Exception as e:
            raise RuntimeError(f"Failed to load gender detection models: {str(e)}. "
                            "Please ensure 'gender_deploy.prototxt' and 'gender_net.caffemodel' "
                            "are in the 'models' directory.")
        
        # Initialize face detection
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        # State tracking
        self.last_alert_time = 0
        self.alerts: List[Alert] = []
        self.current_counts = {'male': 0, 'female': 0}
        self.person_boxes = []  # Store detected person boxes with gender info
        
        # Gesture tracking
        self.current_gesture = {
            'detected': False,
            'type': None,
            'confidence': 0.0,
            'handsCount': 0
        }

    def detect_genders(self, frame: np.ndarray) -> np.ndarray:
        """Detect faces and classify gender in the frame"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        male_count = 0
        female_count = 0
        labels = ['Male', 'Female']
        self.person_boxes = []  # Reset person boxes for this frame
        
        for (x, y, w, h) in faces:
            face = frame[y:y+h, x:x+w]
            blob = cv2.dnn.blobFromImage(
                face, 1.0, (227, 227),
                (78.4263377603, 87.7689143744, 114.895847746),
                swapRB=False
            )
            self.gender_net.setInput(blob)
            predictions = self.gender_net.forward()
            
            gender = labels[predictions[0].argmax()]
            confidence = predictions[0].max()
            
            if gender == "Female":
                female_count += 1
                color = (0, 255, 0)  # Green
                gender_label = 'female'
            else:
                male_count += 1
                color = (255, 0, 0)  # Blue
                gender_label = 'male'
            
            # Store person box with gender info (x, y, w, h, gender)
            self.person_boxes.append((x, y, w, h, gender_label))
            
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(frame, f"{gender}: {confidence:.2f}", (x, y-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
        
        self.current_counts = {'male': male_count, 'female': female_count}
        return frame

    def _check_left_hand_gestures(self, landmarks) -> Optional[str]:
        """Check for specific distress gestures in left hand"""
        thumb_tip = landmarks[self.mp_hands.HandLandmark.THUMB_TIP]
        index_tip = landmarks[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
        pinky_tip = landmarks[self.mp_hands.HandLandmark.PINKY_TIP]
        wrist = landmarks[self.mp_hands.HandLandmark.WRIST]
        
        # 1. Thumb touching palm (closed fist)
        if ((thumb_tip.x - wrist.x)**2 + (thumb_tip.y - wrist.y)**2)**0.5 < self.config.gesture_thresholds['thumb_palm']:
            return "thumb_palm"
        
        # 2. Waving gesture (fingers spread)
        if ((index_tip.x - pinky_tip.x)**2 + (index_tip.y - pinky_tip.y)**2)**0.5 > self.config.gesture_thresholds['wave']:
            return "wave"
        
        # 3. Thumb folded across palm
        if (thumb_tip.x < wrist.x and 
            abs(thumb_tip.y - wrist.y) < self.config.gesture_thresholds['thumb_folded']):
            return "thumb_folded"
        
        return None

    def detect_gestures(self, frame: np.ndarray) -> Tuple[Optional[str], np.ndarray]:
        """Detect hand gestures, draw them on frame, and return distress type if found"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        detected_gesture = None
        hands_count = 0
        max_confidence = 0.0
        
        if results.multi_hand_landmarks:
            hands_count = len(results.multi_hand_landmarks)
            for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
                # Draw hand landmarks on the frame
                self.mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS,
                    self.mp_drawing_styles.get_default_hand_landmarks_style(),
                    self.mp_drawing_styles.get_default_hand_connections_style()
                )
                
                # Check for distress gestures
                handedness = results.multi_handedness[i]
                # MediaPipe detects hands from camera perspective (mirror image)
                # So we need to flip: "Left" in camera = Right hand in reality
                hand_label = handedness.classification[0].label
                actual_hand = "Right" if hand_label == "Left" else "Left"
                confidence = handedness.classification[0].score
                
                if confidence > max_confidence:
                    max_confidence = confidence
                
                # Check gestures on left hand only (which appears as "Right" in camera)
                if hand_label == "Right":  # This is actually the user's left hand
                    gesture = self._check_left_hand_gestures(hand_landmarks.landmark)
                    if gesture:
                        detected_gesture = gesture
                        
                        # Draw gesture label on frame
                        # Get wrist position for label placement
                        h, w, c = frame.shape
                        wrist = hand_landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
                        cx, cy = int(wrist.x * w), int(wrist.y * h)
                        
                        # Display gesture name with background
                        gesture_text = f"GESTURE: {gesture.upper()}"
                        text_size = cv2.getTextSize(gesture_text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
                        
                        # Draw background rectangle
                        cv2.rectangle(frame, 
                                    (cx - 10, cy - text_size[1] - 15), 
                                    (cx + text_size[0] + 10, cy - 5), 
                                    (0, 0, 255), -1)
                        
                        # Draw text
                        cv2.putText(frame, gesture_text, (cx, cy - 10), 
                                  cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                
                # Show actual hand label (corrected for mirror image)
                h, w, c = frame.shape
                wrist = hand_landmarks.landmark[self.mp_hands.HandLandmark.WRIST]
                cx, cy = int(wrist.x * w), int(wrist.y * h)
                
                # Draw hand label with actual hand (not mirrored)
                cv2.putText(frame, f"{actual_hand} Hand", (cx + 10, cy + 20), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
        
        # Update current gesture state
        self.current_gesture = {
            'detected': detected_gesture is not None,
            'type': detected_gesture,
            'confidence': max_confidence,
            'handsCount': hands_count
        }
        
        return detected_gesture, frame

    def process_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Optional[Alert]]:
        """Process a frame and return (annotated_frame, alert_if_triggered)"""
        # Detect genders and update counts
        frame = self.detect_genders(frame)
        
        # Detect and draw hand gestures on frame
        gesture, frame = self.detect_gestures(frame)
        
        # Check for distress gestures
        current_time = time.time()
        if current_time - self.last_alert_time > self.config.alert_cooldown:
            female_count = self.current_counts['female']
            male_count = self.current_counts['male']
            
            # Check for gesture-based alert
            if gesture:
                self.last_alert_time = current_time
                alert = self._create_alert(frame, "distress", gesture)
                return frame, alert
        # # Woman is with multiple men (possible risk)
        #     elif female_count == 1 and male_count >= 2:
        #         self.last_alert_time = current_time
        #         alert = self._create_alert(frame, "woman_surrounded")
        #         return frame, alert

        #         # Woman is surrounded by men spatially (closer proximity)
        #     elif female_count == 1 and male_count >= 1:
        #             if self._is_surrounded(frame):  # You’ll implement this separately
        #                 self.last_alert_time = current_time
        #                 alert = self._create_alert(frame, "woman_surrounded_spatial")
        #                 return frame, alert
            
            # Check for gender anomaly at night
            if is_nighttime(self.config.night_start_hour, self.config.night_end_hour):
                female_count = self.current_counts['female']
                male_count = self.current_counts['male']
    
                # Woman is alone
                if female_count == 1 and male_count == 0:
                    self.last_alert_time = current_time
                    alert = self._create_alert(frame, "lone_woman_night")
                    return frame, alert

                # Woman is with multiple men (possible risk)
                elif female_count == 1 and male_count >= 2:
                    self.last_alert_time = current_time
                    alert = self._create_alert(frame, "woman_surrounded")
                    return frame, alert

                # Woman is surrounded by men spatially (closer proximity)
                elif female_count == 1 and male_count >= 1:
                    if self._is_surrounded(frame):  # You’ll implement this separately
                        self.last_alert_time = current_time
                        alert = self._create_alert(frame, "woman_surrounded_spatial")
                        return frame, alert

        
        return frame, None
    
    def _is_surrounded(self, frame):
        # self.person_boxes contains [(x, y, w, h, gender), ...]
        females = [box for box in self.person_boxes if box[-1] == 'female']
        males = [box for box in self.person_boxes if box[-1] == 'male']

        if not females or not males:
            return False

        woman_box = females[0]
        wx, wy, ww, wh = woman_box[:4]

        for mx, my, mw, mh, _ in males:
            # Simple proximity check: if male is within a threshold distance
            if abs(mx - wx) < 100 and abs(my - wy) < 100:
                return True

        return False


    def _create_alert(self, frame: np.ndarray, alert_type: str, gesture: str = None) -> Alert:
        frame_path = save_alert_frame(frame)
        lat, lng = get_location()

        # Save to in-memory alert list (optional)
        alert = Alert(
            alert_type=alert_type,
            timestamp=ist_now(),
            latitude=lat,
            longitude=lng,
            frame_path=frame_path,
            male_count=self.current_counts['male'],
            female_count=self.current_counts['female'],
            gesture=gesture
        )
        self.alerts.append(alert)

        # Save to DB
        db_alert = DBAlert(
            alert_type=alert_type,
            latitude=lat,
            longitude=lng,
            frame_path=frame_path,
            male_count=self.current_counts['male'],
            female_count=self.current_counts['female'],
            gesture=gesture
        )
        db.session.add(db_alert)
        db.session.commit()

        return alert


    def get_latest_alerts(self, limit: int = 5) -> List[Alert]:
        """Get most recent alerts"""
        return sorted(self.alerts, key=lambda x: x.timestamp, reverse=True)[:limit]

    def release(self):
        """Release resources"""
        self.hands.close()