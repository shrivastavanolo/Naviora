import { NextResponse } from "next/server";
import { verifyVerificationToken } from "@/src/lib/auth";
import { UserRepository } from "@/src/repositories/user.repository";
import { getErrorResponse } from "@/src/lib/error-handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Missing token" },
        { status: 400 }
      );
    }

    const userId = await verifyVerificationToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    await UserRepository.update(userId, {
      emailVerified: new Date(),
    });

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
