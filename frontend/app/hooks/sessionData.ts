"use client";

import { useState, useEffect } from "react";
import { StoredData } from "@/types/scan";

export function useScanResult() {
  const [data, setData] = useState<StoredData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("scanResult");
    if (raw) {
      const parsed = JSON.parse(raw);
      setData(parsed);
      console.log("LOG SESSION DATA:", parsed);
    } else {
      console.warn("❗ Tidak ada data scan di sessionStorage");
    }
  }, []);

  return data;
}
