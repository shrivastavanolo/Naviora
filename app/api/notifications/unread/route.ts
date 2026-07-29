import { requireAuth } from "@/src/lib/require-auth";
import { NotificationService } from "@/src/services/notification.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await NotificationService.getUnreadCount(user.id);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
