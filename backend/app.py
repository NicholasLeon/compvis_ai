from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import os, tempfile

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "yolo11n.pt")
model = YOLO(MODEL_PATH)

@app.post("/scan")
async def predict(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        results = model(temp_path)
        boxes = results[0].boxes.xyxy.tolist() if results[0].boxes is not None else []
        classes = results[0].boxes.cls.tolist() if results[0].boxes is not None else []
        confs = results[0].boxes.conf.tolist() if results[0].boxes is not None else []

        return {
            "num_detections": len(boxes),
            "detections": [
                {"box": box, "class": cls, "confidence": conf}
                for box, cls, conf in zip(boxes, classes, confs)
            ]
        }
    finally:
        try:
            os.remove(temp_path)
        except:
            pass