import { AuthService } from "@/src/services/auth.services";
import { signToken } from "@/src/lib/auth";
import { loginSchema } from "@/src/schemas/auth";

import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";

import { AUTH_COOKIE, TOKEN_EXPIRY } from "@/src/lib/constants";

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
