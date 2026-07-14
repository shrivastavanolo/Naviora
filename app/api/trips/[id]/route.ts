import { requireAuth } from "@/src/lib/require-auth";
import { updateTripSchema } from "@/src/schemas/trip";
import { TripService } from "@/src/services/trip.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

/**
 * @swagger
 * /api/trips/{id}:
 *   patch:
 *     summary: Update a trip
 *     description: Updates one or more fields of a trip owned by the authenticated user.
 *     tags:
 *       - Trips
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
 *             $ref: '#/components/schemas/UpdateTripInput'
 *     responses:
 *       200:
 *         description: Trip updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const data = updateTripSchema.parse(body);
    const trip = await TripService.updateTrip(user.id, id, data);

    return NextResponse.json(
      {
        success: true,
        data: trip,
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

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     description: Retrieves a trip owned by the authenticated user.
 *     tags:
 *       - Trips
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
 *         description: Trip retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const trip = await TripService.getTrip(user.id, id);

    return NextResponse.json(
      {
        success: true,
        data: trip,
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

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     description: Deletes a trip owned by the authenticated user.
 *     tags:
 *       - Trips
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
 *         description: Trip deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    await TripService.deleteTrip(user.id, id);

    return NextResponse.json(
      {
        success: true,
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
