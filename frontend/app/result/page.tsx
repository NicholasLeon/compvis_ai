"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ScanStoredData {
  plate_number: string;
  expiry_date: string;
  success: boolean;
  imageUrl?: string;
}

export default function ResultPage() {
  const [data, setData] = useState<ScanStoredData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("scanResult");
    if (raw) {
      setData(JSON.parse(raw));
      console.log("DATA DARI SESSION:", JSON.parse(raw));
    } else {
      console.warn("❗ Tidak ada data scan di sessionStorage");
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* LEFT SIDE — IMAGE */}
        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-center items-center">
          {data?.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt="Uploaded image"
              width={500}
              height={400}
              className="rounded-lg object-contain"
            />
          ) : (
            <p className="text-gray-400">Tidak ada gambar</p>
          )}
        </div>

        {/* RIGHT SIDE — RESULT INFO */}
        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
          <h2 className="text-2xl font-bold mb-4">Hasil Scan</h2>

          <div className="space-y-4">
            <p>
              <span className="text-gray-400">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${
                  data?.success
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {data?.success ? "Sukses" : "Gagal"}
              </span>
            </p>

            <div>
              <label className="text-gray-400 text-sm uppercase">
                Nomor Polisi
              </label>
              <div className="text-3xl font-mono font-bold mt-1">
                {data?.plate_number || "-"}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm uppercase">
                Masa Berlaku
              </label>
              <div className="text-xl font-medium mt-1">
                {data?.expiry_date || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
