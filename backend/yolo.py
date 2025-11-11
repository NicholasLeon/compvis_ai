from ultralytics import YOLO
import os


image_path = os.path.abspath("test.jpg") #dummy image
model = YOLO("yolov8n.pt")

results = model(image_path)

#detection
if results:
    results[0].show()
else:
    print("No Results")