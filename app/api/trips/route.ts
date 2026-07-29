import { requireAuth } from "@/src/lib/require-auth";
import { createTripSchema } from "@/src/schemas/trip";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a trip
 *     tags:
 *       - Trips
 *     security:
 *       - cookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const data = createTripSchema.parse(body);
    const trip = await TripService.createTrip(user.id, data);

    return NextResponse.json(
      {
        success: true,
        data: trip,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags:
 *       - Trips
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       200:
 *         description: Trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "9", 10)));
    const q = searchParams.get("q")?.trim() || undefined;

    const result = await TripService.getMyTrips(user.id, page, limit, q);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
