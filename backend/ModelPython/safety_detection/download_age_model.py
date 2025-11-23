"""
Script to download the age detection model weights.
The age_net.caffemodel file is required for age detection.

Run this script to download the model automatically.
"""

import urllib.request
import os

# URL for the age detection caffemodel
AGE_MODEL_URL = "https://github.com/GilLevi/AgeGenderDeepLearning/raw/master/models/age_net.caffemodel"

# Path to save the model
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
AGE_MODEL_PATH = os.path.join(MODEL_DIR, 'age_net.caffemodel')

def download_age_model():
    """Download the age detection model if it doesn't exist."""
    if os.path.exists(AGE_MODEL_PATH):
        print(f"Age model already exists at: {AGE_MODEL_PATH}")
        return True
    
    print("Downloading age detection model...")
    print(f"This may take a few minutes. File size: ~23MB")
    
    try:
        # Create models directory if it doesn't exist
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        # Download the model
        urllib.request.urlretrieve(AGE_MODEL_URL, AGE_MODEL_PATH)
        print(f"✓ Successfully downloaded age model to: {AGE_MODEL_PATH}")
        return True
    except Exception as e:
        print(f"✗ Error downloading age model: {str(e)}")
        print("\nManual download instructions:")
        print(f"1. Download from: {AGE_MODEL_URL}")
        print(f"2. Save to: {AGE_MODEL_PATH}")
        return False

if __name__ == "__main__":
    success = download_age_model()
    if success:
        print("\n✓ Age detection model is ready!")
    else:
        print("\n✗ Please download the model manually.")
