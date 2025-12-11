import { NextResponse } from "next/server";
import { getVehicleByPlate } from "@/lib/vehicle";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate");

  console.log("LOG Plat Nomor:", plate);

  if (!plate) {
    return NextResponse.json(
      { error: "Plat Nomor Tidak Ditemukan Di URL" },
      { status: 400 }
    );
  }

  try {
    const vehicle = await getVehicleByPlate(plate);

    console.log("LOG Hasil Query:", vehicle);

    if (!vehicle) {
      return NextResponse.json(
        { found: false, message: "Data tidak ditemukan di database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ found: true, data: vehicle }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
