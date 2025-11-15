from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import os, tempfile

app = FastAPI()
model = YOLO("yolo11n.pt")

@app.post("/scan")
async def predict(file: UploadFile = File(...)):
    #post temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        #Run yolo
        results = model(temp_path)

        #catch detection
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
        #Delete file
        try:
            os.remove(temp_path)
        except PermissionError:
            import time
            time.sleep(0.2)
            try:
                os.remove(temp_path)
            except Exception as e:
                print(f"Failed to delete file: {e}")