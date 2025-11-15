from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import easyocr
import cv2
import numpy as np

app = FastAPI()

# Load YOLO model
model = YOLO("runs/detect/train13/weights/best.pt")

# EasyOCR with GPU
reader = easyocr.Reader(['en'], gpu=True)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img)

    plate_text = None

    for box in results[0].boxes:
        cls = int(box.cls)
        cls_name = results[0].names[cls]
        print("Detected:", cls_name)

        if cls_name == "license_plate":
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            crop = img[y1:y2, x1:x2]

            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

            # Detail=1 supaya ada confidence + bbox
            ocr = reader.readtext(binary, allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

            if len(ocr) > 0:
                # Text with biggest confidence
                best = max(ocr, key=lambda x: x[2])
                plate_text = best[1]
                
    return {
        "plate_number": plate_text,
        "success": plate_text is not None
    }
