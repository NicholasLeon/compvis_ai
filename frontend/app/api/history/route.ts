"use server";

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "@/auth";

function parseIndonesianDate(expiryStr: string): Date | null {
  try {
    console.log(`LOG RAW DATE: "${expiryStr}"`);

    // Membersihkan string
    const cleaned = expiryStr.replace(/[^0-9]/g, "");

    console.log(`LOG CLEANED: "${cleaned}"`);

    if (cleaned.length !== 4) return null;

    const month = parseInt(cleaned.substring(0, 2)); // "05" -> 5
    const yearShort = parseInt(cleaned.substring(2, 4)); // "27" -> 27
    const yearFull = 2000 + yearShort; // -> 2027

    // Validasi bulan (1-12)
    if (month < 1 || month > 12) return null;

    const lastDayOfMonth = new Date(Date.UTC(yearFull, month, 0));

    console.log(`✅ HASIL PARSING: ${lastDayOfMonth.toISOString()}`);

    return lastDayOfMonth;
  } catch (e) {
    console.error("Parsing Error:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    console.log("SESSION DATA:", JSON.stringify(session, null, 2));

    if (!session?.user?.id)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    const userId = session.user.id;

    const { plate_number, expiry_date, success, imageUrl } = await req.json();

    const validDate = parseIndonesianDate(expiry_date);

    if (!validDate) {
      return NextResponse.json(
        { message: "Gagal Mengubah Tanggal" },
        { status: 400 }
      );
    }

    const history = await prisma.scanHistory.create({
      data: {
        platNomor: plate_number,
        expiryDate: new Date(validDate),
        imageUrl,
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
