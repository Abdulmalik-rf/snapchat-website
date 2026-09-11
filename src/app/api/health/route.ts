import { NextResponse } from "next/server";
import { configured } from "@/lib/env";

/** GET /api/health — يوضّح أي التكاملات مضبوطة (بدون كشف أسرار) */
export async function GET() {
  return NextResponse.json({ ok: true, configured });
}
