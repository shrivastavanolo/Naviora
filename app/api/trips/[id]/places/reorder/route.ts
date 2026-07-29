import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth } from "@/src/lib/require-auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { PlaceService } from "@/src/services/place.services";

const reorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      visitOrder: z.number().int().positive(),
    })
  ),
  dayId: z.string().optional(),
});

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;

    const body = await _request.json();
    const { orders, dayId } = reorderSchema.parse(body);

    const updated = await PlaceService.reorderPlaces(user.id, tripId, orders, dayId);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
