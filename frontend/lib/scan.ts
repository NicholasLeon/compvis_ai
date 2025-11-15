"use server";

import { log } from "console";
import fs from "fs";
import path from "path";

export async function scanImage() {
  const filePath = path.resolve(process.cwd(), "../backend/test.jpeg");
  const fileBuffer = await fs.promises.readFile(filePath);

  const blob = new Blob([fileBuffer], { type: "image/jpeg" });
  const formData = new FormData();
  formData.append("file", blob, "test.jpeg");

  console.log("File to send:", blob);
  console.log("FormData entries:");
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  const res = await fetch("http://127.0.0.1:8000/scan", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend error response:", text);
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  log(data);
  return data;
}
