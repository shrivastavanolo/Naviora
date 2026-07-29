import { requireAuth } from "@/src/lib/require-auth";
import { NotificationService } from "@/src/services/notification.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const result = await NotificationService.getNotifications(user.id, page, limit);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
