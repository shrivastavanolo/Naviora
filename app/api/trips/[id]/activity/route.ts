import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { ActivityLogService } from "@/src/services/activity-log.services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const result = await ActivityLogService.getLogs(user.id, tripId, page, limit);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
