import { NextResponse } from "next/server";
import { getEnv } from "@/src/config/env";

export async function GET(request: Request) {
  const env = getEnv();

  if (!env.GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { message: "Google OAuth is not configured" },
      { status: 501 }
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/google/callback`;

  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  const response = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );

  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
