import { requireAuth } from "@/src/lib/require-auth";
import { updatePlaceSchema } from "@/src/schemas/place";
import { PlaceService } from "@/src/services/place.services";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Get a place by ID
 *     description: Retrieves a specific place belonging to one of the authenticated user's trips.
 *     tags:
 *       - Places
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Place ID
 *         schema:
 *           type: string
 *           example: cmrgo81h40002uvquq4r5bss3
 *     responses:
 *       200:
 *         description: Place retrieved successfully.
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
    const { id: placeId } = await params;

    const place = await PlaceService.getPlace(user.id, placeId);

    return NextResponse.json(
      {
        success: true,
        data: place,
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
 * /api/places/{id}:
 *   patch:
 *     summary: Update a place
 *     description: Updates one or more fields of a place belonging to the authenticated user.
 *     tags:
 *       - Places
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Place ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               notes:
 *                 type: string
 *               estimatedDuration:
 *                 type: integer
 *               visitOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Place updated successfully.
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
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: placeId } = await params;
    const body = await request.json();

    const data = updatePlaceSchema.parse(body);
    const place = await PlaceService.updatePlace(user.id, placeId, data);

    return NextResponse.json(
      {
        success: true,
        data: place,
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
 * /api/places/{id}:
 *   delete:
 *     summary: Delete a place
 *     description: Deletes a place owned by the authenticated user.
 *     tags:
 *       - Places
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Place ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Place deleted successfully.
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: placeId } = await params;

    await PlaceService.deletePlace(user.id, placeId);

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
