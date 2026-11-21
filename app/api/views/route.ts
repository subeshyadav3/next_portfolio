import { NextResponse } from "next/server";

// Page view tracking disabled to prevent exceeding Vercel Fluid CPU and Neon DB compute limits.
export async function POST() {
  return NextResponse.json({ ok: true, disabled: true });
}

