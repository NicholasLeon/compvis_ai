import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");
  console.log("Test API Request yang masuk ke /api/vehicleDataMatching");
  console.log("LOG Plat Nomer Yang diterima:", plate);

  if (!plate) {
    return NextResponse.json(
      { error: "Plat Nomer Tidak Ditemukan Di Database" },
      { status: 400 }
    );
  }

  try {
    const findVehicleData = await prisma.vehicle.findFirst({
      where: {
        platNomor: {
          equals: plate,
          mode: "insensitive",
        },
      },
    });
    console.log("LOG Query prisma:", findVehicleData);

    if (!findVehicleData) {
      return NextResponse.json(
        { found: false, message: "Data tidak ditemukan di database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        found: true,
        data: findVehicleData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
