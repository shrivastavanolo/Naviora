import { NextResponse } from "next/server";

import { signupSchema } from "@/src/schemas/auth";
import { AuthService } from "@/src/services/auth.services";

import { getErrorResponse } from "@/src/lib/error-handler";

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: User with the provided email already exists.
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = signupSchema.parse(body);

    const user = await AuthService.signup(data);

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
