import { requireAuth } from "@/src/lib/require-auth";
import { createPlaceSchema } from "@/src/schemas/place";
import { PlaceService } from "@/src/services/place.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

/**
 * @swagger
 * /api/trips/{id}/places:
 *   post:
 *     summary: Add a place to a trip
 *     description: Creates a new place for a trip owned by the authenticated user.
 *     tags:
 *       - Places
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip ID
 *         schema:
 *           type: string
 *           example: cmrgo81h40002uvquq4r5bss3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlaceInput'
 *     responses:
 *       201:
 *         description: Place created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Place'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;
    const body = await request.json();

    const data = createPlaceSchema.parse(body);
    const place = await PlaceService.createPlace(user.id, tripId, {
      ...data,
      dayId: body.dayId,
    });

    return NextResponse.json(
      {
        success: true,
        data: place,
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
 * /api/trips/{id}/places:
 *   get:
 *     summary: Get all places for a trip
 *     description: Returns all places associated with a trip owned by the authenticated user.
 *     tags:
 *       - Places
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Trip ID
 *         schema:
 *           type: string
 *           example: cmrgo81h40002uvquq4r5bss3
 *     responses:
 *       200:
 *         description: Places retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Place'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: tripId } = await params;

    const places = await PlaceService.getTripPlaces(user.id, tripId);

    return NextResponse.json(
      {
        success: true,
        data: places,
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
