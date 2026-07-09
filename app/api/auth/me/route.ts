import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";

export async function GET() {
  const user = await requireAuth();

  return NextResponse.json({
    success: true,
    data: user,
  });
}
