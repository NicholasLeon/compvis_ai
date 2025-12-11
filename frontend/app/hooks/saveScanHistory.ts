"use client";

import { useEffect } from "react";
import { StoredData } from "@/types/scan";

export function useSaveScanHistory(data: StoredData | null) {
  useEffect(() => {
    if (!data) return;

    async function save() {
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log("📌 HASIL SAVE HISTORY:", result);
      } catch (err) {
        console.error("❌ Gagal menyimpan history:", err);
      }
    }

    save();
  }, [data]);
}
