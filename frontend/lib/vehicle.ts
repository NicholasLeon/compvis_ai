import { prisma } from "@/lib/prisma";

export async function getVehicleByPlate(plate: string) {
  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        platNomor: {
          equals: plate,
          mode: "insensitive",
        },
      },
    });

    return vehicle;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal mengambil data kendaraan");
  }
}
