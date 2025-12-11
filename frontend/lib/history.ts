"use server";

import { prisma } from "@/lib/prisma";

export async function getScanHistory() {
  try {
    const history = await prisma.scanHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        vehicle: true,
      },
      take: 50,
    });
    return { success: true, data: history };
  } catch (error) {
    console.error("Gagal ambil history:", error);
    return { success: false, data: [] };
  }
}

export async function getHistoryById(id: string) {
  try {
    const history = await prisma.scanHistory.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!history) {
      return { success: false, data: null };
    }

    // Jika history ketemu, tapi vehicle-nya null (belum ter-link relasinya), maka cari manual berdasarkan string plat nomornya.
    let vehicleData = history.vehicle;

    if (!vehicleData) {
      console.log("⚠️ Relasi kosong, mencoba mencari manual by Plat Nomor...");
      vehicleData = await prisma.vehicle.findFirst({
        where: {
          platNomor: {
            equals: history.platNomor,
            mode: "insensitive",
          },
        },
      });
    }

    // Manipulasi object agar 'vehicle' terisi data hasil pencarian manual tadi
    const resultData = {
      ...history,
      vehicle: vehicleData,
    };

    return { success: true, data: resultData };
  } catch (error) {
    console.error("Error getHistoryById:", error);
    return { success: false, data: null };
  }
}
