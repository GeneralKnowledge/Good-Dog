import { NextResponse } from "next/server";
import { getVapidPublicKey, isPushConfigured } from "@/lib/push/vapid";

export const runtime = "nodejs";

export async function GET() {
  if (!isPushConfigured()) {
    return NextResponse.json({ configured: false, publicKey: null }, { status: 200 });
  }
  return NextResponse.json({
    configured: true,
    publicKey: getVapidPublicKey(),
  });
}
