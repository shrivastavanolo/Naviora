import { AuthService } from "@/src/services/auth.services";
import { signToken } from "@/src/lib/auth";
import { loginSchema } from "@/src/schemas/auth";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

import { AUTH_COOKIE, TOKEN_EXPIRY } from "@/src/lib/constants";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user with their email and password and returns the authenticated user. A JWT is stored in an HTTP-only cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only JWT authentication cookie.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = loginSchema.parse(body);

    const user = await AuthService.login(data);
    const token = await signToken(user.id);

    const response = NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    );

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRY,
    });
    return response;
  } catch (error) {
    const { status, body } = getErrorResponse(error);

    return NextResponse.json(body, { status });
  }
}
