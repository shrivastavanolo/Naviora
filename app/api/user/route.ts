import { requireAuth } from "@/src/lib/require-auth";
import { updateProfileSchema } from "@/src/schemas/user";
import { UserService } from "@/src/services/user.services";
import { NextResponse } from "next/server";
import { getErrorResponse } from "@/src/lib/error-handler";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/src/lib/constants";

export async function GET() {
  try {
    const user = await requireAuth();
    const profile = await UserService.getProfile(user.id);

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = updateProfileSchema.parse(body);
    const profile = await UserService.updateProfile(user.id, data);

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE() {
  try {
    const user = await requireAuth();
    await UserService.deleteAccount(user.id);

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
