import { NextResponse } from "next/server";

import { signupSchema } from "@/src/schemas/auth";
import { AuthService } from "@/src/services/auth.services";
import { signToken } from "@/src/lib/auth";

import { getErrorResponse } from "@/src/lib/error-handler";
import { AUTH_COOKIE, TOKEN_EXPIRY } from "@/src/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = signupSchema.parse(body);

    const user = await AuthService.signup(data);
    const token = await signToken(user.id);

    const response = NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 201,
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
