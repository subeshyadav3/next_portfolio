import { NextResponse } from "next/server";

// Deprecated endpoint: View tracking is unified under /api/views to prevent double counting.
export async function POST() {
  return NextResponse.json({ ok: true, deprecated: true });
}
