import { NextResponse } from "next/server";

import { signupSchema } from "@/src/schemas/auth";
import { AuthService } from "@/src/services/auth.services";

import { getErrorResponse } from "@/src/lib/error-handler";

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
