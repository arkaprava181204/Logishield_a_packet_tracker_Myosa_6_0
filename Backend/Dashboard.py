from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import cv2
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://logishield.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/Scan")
async def scan(request: Request):

    # Receive raw image bytes
    image_bytes = await request.body()

    # Convert bytes → NumPy array
    image_array = np.frombuffer(image_bytes, np.uint8)

    # Convert NumPy array → OpenCV image
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # QR detector
    detector = cv2.QRCodeDetector()

    data, points, _ = detector.detectAndDecode(image)

    if not data:
        return {
            "success": False,
            "message": "QR code not detected"
        }

    # Convert QR JSON string → Python object
    records = json.loads(data)

    # Create DataFrame
    df = pd.DataFrame(records)

    print(records)
    print(df)

    return {
        "success": True,
        "data": records
    }