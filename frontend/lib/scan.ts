import { ScanResponseSchema, type ScanResponse } from "../types/scan";

export async function scanLicensePlate(
  formData: FormData
): Promise<ScanResponse> {
  try {
    const res = await fetch("http://127.0.0.1:8000/detect", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}`);
    }

    const json = await res.json();

    // Validasi response dari backend
    const parsed = ScanResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Zod Validation Error:", parsed.error);
      throw new Error("Response format invalid");
    }

    return parsed.data;
  } catch (err) {
    console.error("scanLicensePlate ERROR:", err);

    // Fallback supaya UI tidak rusak
    return {
      plate_number: null,
      expiry_date: null,
      success: false,
    };
  }
}
