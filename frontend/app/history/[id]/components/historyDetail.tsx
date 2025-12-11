import { getHistoryById } from "../../../../lib/history";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const formatDate = (date: Date | string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default async function HistoryDetailPage({ id }: { id: string }) {
  const { success, data } = await getHistoryById(id);

  if (!success || !data) {
    return notFound();
  }

  const scanData = {
    imageUrl: data.imageUrl,
    plate_number: data.platNomor,
  };

  const vehicleInfo = data.vehicle;

  // Logic UI (vehicle null, notFound = true)
  const isVehicleFound = !!vehicleInfo;

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 relative">
      {/* Tombol Back (Biar user bisa balik ke list) */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/history"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2"
        >
          ←
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mt-10 md:mt-0">
        {/* KIRI — GAMBAR HASIL SCAN */}
        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex flex-col gap-4">
          <div className="flex justify-center items-center grow min-h-[300px] bg-black/20 rounded-lg relative">
            {scanData.imageUrl ? (
              <Image
                src={scanData.imageUrl}
                alt="Uploaded image"
                width={500}
                height={400}
                className="rounded-lg object-contain max-h-[400px]"
              />
            ) : (
              <p className="text-gray-500 italic">Tidak ada gambar scan</p>
            )}
          </div>
        </div>

        {/* KANAN — INFO DATABASE */}
        <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 flex flex-col">
          <div className="mb-6 border-b border-zinc-700 pb-4">
            <h2 className="text-2xl font-bold text-white">Detail Riwayat</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Data yang tersimpan pada {formatDate(data.createdAt)}
            </p>
          </div>

          {/* Section: Nomor Polisi (Utama) */}
          <div className="mb-6 bg-zinc-900 p-4 rounded-lg border border-zinc-700 text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
              Nomor Polisi (Hasil Scan)
            </p>
            <h1 className="text-4xl font-mono font-bold tracking-widest text-white">
              {scanData.plate_number || "--- ---- --"}
            </h1>
          </div>

          {/* Section: Detail Data */}
          <div className="grow">
            {!isVehicleFound ? (
              // State Tidak Ditemukan
              <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-red-400 font-semibold text-lg">
                  Data Tidak Ditemukan
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Saat scan dilakukan, plat ini tidak terdaftar di database.
                </p>
              </div>
            ) : (
              // State Data Ditemukan (vehicleInfo PASTI ada disini karena else)
              <div className="space-y-4">
                {/* Status Pajak & Kendaraan */}
                <div className="flex gap-3">
                  <div
                    className={`flex-1 p-3 rounded-lg border ${
                      vehicleInfo!.status === "Aktif"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    <p className="text-xs uppercase opacity-70 mb-1">
                      Status Pajak
                    </p>
                    <p className="font-bold">{vehicleInfo!.status}</p>
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-700">
                    <p className="text-xs uppercase text-zinc-500 mb-1">
                      Berlaku Sampai
                    </p>
                    <p className="font-medium text-zinc-200">
                      {formatDate(vehicleInfo!.pajakBerakhir)}
                    </p>
                  </div>
                </div>

                {/* Detail Kendaraan */}
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Pemilik</span>
                    <span className="font-semibold text-white">
                      {vehicleInfo!.pemilik}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Jenis</span>
                    <span className="text-zinc-200">{vehicleInfo!.jenis}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Merk / Model</span>
                    <span className="text-zinc-200 text-right">
                      {vehicleInfo!.merk}
                      <br />
                      <span className="text-xs text-zinc-500">
                        {vehicleInfo!.model}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Warna</span>
                    <span className="text-zinc-200">{vehicleInfo!.warna}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-zinc-400">Tahun Pembuatan</span>
                    <span className="text-zinc-200">{vehicleInfo!.tahun}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
