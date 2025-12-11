import Image from "next/image";
import { getScanHistory } from "../../../lib/history";
import Link from "next/link";

export default async function HistoryPage() {
  const { data: historyData } = await getScanHistory();

  const formatDateTime = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-3xl font-bold">Riwayat Pemindaian</h1>
        </header>

        {historyData.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Belum ada riwayat scan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {historyData.map((item) => {
              return (
                <Link
                  href={`/history/${item.id}`}
                  key={item.id}
                  className="block group"
                >
                  <div
                    key={item.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors group"
                  >
                    <div className="relative h-48 bg-black/50 w-full">
                      <Image
                        src={item.imageUrl || "/fallback-image.png"}
                        alt={`Scan ${item.platNomor}`}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">
                            Hasil Scan
                          </p>
                          <h3 className="text-xl font-mono font-bold text-white">
                            {item.platNomor}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider">
                            Waktu
                          </p>
                          <p className="text-xs text-zinc-300 mt-1">
                            {formatDateTime(item.createdAt)}
                          </p>
                        </div>
                      </div>

                      {item.vehicle && (
                        <div className="mt-3 pt-3 border-t border-zinc-800">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <p className="text-sm font-medium text-blue-200">
                              {item.vehicle.merk} {item.vehicle.model}
                            </p>
                          </div>
                          <p className="text-xs text-zinc-400 ml-4">
                            Pemilik: {item.vehicle.pemilik}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
