from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import easyocr
import cv2
import numpy as np
import re

app = FastAPI()

# Fix CORS block di frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # atau ["http://localhost:4040"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Model
model = YOLO("runs/detect/train3/weights/best.pt")
ocr = easyocr.Reader(['en'], gpu=True, detect_network='craft', recog_network='english_g2')

# KONVERSI KARAKTER
def get_char_replacements():
    # HARUSNYA HURUF (Zona 1 & 3)
    to_char = {'0': 'O', '1': 'I', '2': 'Z', '3': 'J', '4': 'A', '5': 'S', '6': 'G', '7': 'T', '8': 'B'}
    
    # HARUSNYA ANGKA (Zona 2)
    to_int = {'O': '0', 'I': '1', 'Z': '2', 'J': '3', 'A': '4', 'S': '5', 'G': '6', 'T': '7', 'B': '8', 'Q': '0', 'D': '0'}
    
    return to_char, to_int

def clean_noise_text(text):
    # Buang simbol gak jelas
    return re.sub(r'[^A-Z0-9]', '', text.upper())

def smart_fix_plate(parts):
    if not parts:
        return None

    to_char, to_int = get_char_replacements()
    
    # --- LOGIKA BARU: Pre-Check Splitter ---
    # Cek setiap potong, siapatau ada Prefix+Angka nempel
    expanded_parts = []
    for p in parts:
        # Regex 1: Pola Prefix Nempel Angka
        # Mencari 1-2 Huruf diikuti 1-4 Angka (termasuk angka yg mirip huruf)
        match_front = re.match(r'^([A-Z]{1,2})([0-9OIZJASGTB]+)$', p)
        
        # Regex 2: Pola Angka Nempel Suffix 
        match_back = re.match(r'^([0-9OIZJASGTB]{1,4})([A-Z]{1,3})$', p)
        
        # Regex 3: Pola Full Nempel 
        match_full = re.match(r'^([A-Z]{1,2})([0-9OIZJASGTB]+?)([A-Z]{1,3})$', p)

        if match_full:
            expanded_parts.extend(match_full.groups())
        elif match_front:
            expanded_parts.extend(match_front.groups())
        elif match_back:
            expanded_parts.extend(match_back.groups())
        else:
            expanded_parts.append(p)
    
    parts = expanded_parts

    final_parts = []
    
    # Cari index angka
    number_index = -1
    for i, p in enumerate(parts):
        digit_count = sum(c.isdigit() for c in p)
        if len(p) > 0 and (digit_count / len(p) > 0.5):
            number_index = i
            break
            
    if number_index == -1 and len(parts) >= 3:
        number_index = 1
    elif number_index == -1 and len(parts) == 2:
        number_index = 1

    # Loop Perbaikan
    for i, part in enumerate(parts):
        chars = list(part)
        new_part = ""
        
        # ZONA ANGKA
        if i == number_index:
            for c in chars:
                if c in to_int: new_part += to_int[c]
                elif c.isdigit(): new_part += c
                else: new_part += c 
        
        # ZONA HURUF
        else:
            for c in chars:
                if c in to_char: new_part += to_char[c]
                elif c.isalpha(): new_part += c
                else: new_part += c
            
            if i == len(parts) - 1 and len(new_part) == 3 and new_part.endswith('L'):
                new_part = new_part[:-1]

        final_parts.append(new_part)

    return " ".join(final_parts)

def split_sticky_plate(text):
    # Regex mencari pola, Huruf di awal -> Angka (atau huruf mirip angka) di tengah -> Huruf di akhir
    pattern = r'^([A-Z]{1,2})([0-9OIZJASGTB]{1,4})([A-Z]{1,3})$'
    
    match = re.match(pattern, text)
    if match:
        return list(match.groups()) 
    return [text] 


def preprocess(crop):
    # 1. Upscale
    crop = cv2.resize(crop, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)

    # 2. Grayscale
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)

    # 3. Noise Removal (MORPH OPEN) - BUAT MENGHILANGKAN GARIS GRILL/TITIK
    kernel_noise = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    gray = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_noise)

    # 4. Blur
    gray = cv2.GaussianBlur(gray, (5,5), 0)

    # 5. Adaptive Threshold
    binary = cv2.adaptiveThreshold(
        gray, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 
        19, 7
    )

    # 6. Dilation
    # kernel_dilate = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 2))
    # binary = cv2.dilate(binary, kernel_dilate, iterations=1)

    # 7. Border
    binary = cv2.copyMakeBorder(binary, 30, 30, 30, 30, cv2.BORDER_CONSTANT, value=255)

    return binary

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    npimg = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    results = model(img)
    
    final_plate = None
    final_expiry = None

    best_box = None
    max_conf = 0
    for r in results:
        for box in r.boxes:
            cls = int(box.cls)
            if model.names[cls] == "license_plate" and box.conf > max_conf:
                max_conf = box.conf
                best_box = box

    if best_box is not None:
        x1, y1, x2, y2 = map(int, best_box.xyxy[0])
        h_img, w_img, _ = img.shape
        
        # Padding Crop
        padding = 20
        x1 = max(0, x1 - padding)
        y1 = max(0, y1 - padding)
        x2 = min(w_img, x2 + padding)
        y2 = min(h_img, y2 + padding)
        
        crop = img[y1:y2, x1:x2]
        processed = preprocess(crop)
        
        # Debugging Image (Optional)
        # cv2.imwrite("debug_preprocess_general.jpg", processed)

        # OCR
        ocr_result = ocr.readtext(
            processed, 
            detail=1, 
            allowlist='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.',
            paragraph=False,
            text_threshold=0.6,
            low_text=0.3,
            link_threshold=0.4
        )

        if ocr_result:
            # 1. Sort Kiri ke Kanan
            ocr_result.sort(key=lambda x: x[0][0][0])
            
            # 2. FILTER UKURAN (PENTING UNTUK MEMBUANG NOISE KECIL)
            # Hitung rata-rata tinggi teks
            heights = [abs(res[0][2][1] - res[0][0][1]) for res in ocr_result]
            if not heights: return {"success": False}
            
            max_h = max(heights)
            
            valid_parts = []
            
            #Loop hasil OCR
            for (bbox, text, conf) in ocr_result:
                h = abs(bbox[2][1] - bbox[0][1])
                clean = clean_noise_text(text)
                
                # Jika hasil kosong, skip
                if len(clean) == 0:
                    continue

                # --- 1. PRIORITAS: CEK TANGGAL DULU ---
                # Tanggal seringkali kecil, jadi harus ditangkap SEBELUM filter noise.
                is_expiry = False
                
                # Syarat: Isinya Angka, Panjang 4-5 digit, dan Tingginya di bawah 80% plat utama
                if clean.isdigit() and 4 <= len(clean) <= 5 and h < max_h * 0.8:
                    
                    # Logika format tanggal
                    if len(clean) == 5 and clean[2] in ['1', '3', '8']: # Misal 04125 -> 04.25
                         final_expiry = f"{clean[:2]}.{clean[3:]}"
                         is_expiry = True
                    elif len(clean) == 5: 
                         final_expiry = f"{clean[:2]}.{clean[3:]}"
                         is_expiry = True
                    elif len(clean) == 4: # 0425 -> 04.25
                         final_expiry = f"{clean[:2]}.{clean[2:]}"
                         is_expiry = True
                
                # Jika INI ADALAH TANGGAL, simpan dan skip loop ini (jangan dianggap plat)
                if is_expiry:
                    print(f"DEBUG: Found Expiry: {final_expiry} (from {text})")
                    continue

                # --- 2. BARU FILTER SAMPAH (NOISE) ---
                # Jika bukan tanggal, dan ukurannya kecil (< 40%), baru dibuang
                if h < max_h * 0.4:
                    print(f"DEBUG: Ignoring small noise: {text}")
                    continue
                
                # Masukkan ke kandidat plat
                valid_parts.append(clean)
            
            print("DEBUG VALID PARTS:", valid_parts)
            
            # --- FIXING LOGIC ---
            if valid_parts:
                final_plate = smart_fix_plate(valid_parts)

    return {
        "plate_number": final_plate, 
        "expiry_date": final_expiry,
        "success": final_plate is not None
    }