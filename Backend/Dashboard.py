from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import cv2
import numpy as np
import zxingcpp

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

    # Receive image
    image_bytes = await request.body()

    # Bytes -> NumPy
    image_array = np.frombuffer(image_bytes, np.uint8)

    # NumPy -> OpenCV
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        return {
            "success": False,
            "message": "Invalid image"
        }

    # -----------------------------
    # Crop central area
    # -----------------------------

    h, w = image.shape[:2]

    x1 = int(w * 0.20)
    x2 = int(w * 0.80)

    y1 = int(h * 0.15)
    y2 = int(h * 0.75)

    cropped = image[y1:y2, x1:x2]

    # -----------------------------
    # Upscale
    # -----------------------------

    cropped = cv2.resize(
        cropped,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    # -----------------------------
    # ZXing QR decoder
    # -----------------------------

    results = zxingcpp.read_barcodes(
        cropped,
        formats=zxingcpp.BarcodeFormat.QRCode,
        try_rotate=True,
        try_downscale=True,
        try_invert=True
    )

    if not results:
        return {
            "success": False,
            "message": "QR code not detected"
        }

    # First QR result
    qr = results[0]

    data = qr.text

    print("QR DATA:")
    print(data)

    if not data:
        return {
            "success": False,
            "message": "QR detected but no data was decoded"
        }

    # -----------------------------
    # JSON validation
    # -----------------------------

    try:
        records = json.loads(data)

    except json.JSONDecodeError:
        return {
            "success": False,
            "message": "QR detected but contains invalid JSON",
            "raw_data": data
        }

    # -----------------------------
    # DataFrame
    # -----------------------------

    df = pd.DataFrame(records)

    print("RECORDS:")
    print(records)

    print("DATAFRAME:")
    print(df)

    return {
        "success": True,
        "data": records
    }