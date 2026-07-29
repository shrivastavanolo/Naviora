import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEnv } from "@/src/config/env";
import { UserRepository } from "@/src/repositories/user.repository";
import { signToken } from "@/src/lib/auth";
import { AUTH_COOKIE, TOKEN_EXPIRY } from "@/src/lib/constants";

export async function GET(request: Request) {
  const env = getEnv();

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { message: "Google OAuth is not configured" },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  cookieStore.set("google_oauth_state", "", { maxAge: 0, path: "/" });

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/google/callback`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { message: "Failed to exchange code" },
      { status: 400 }
    );
  }

  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;

  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!userResponse.ok) {
    return NextResponse.json(
      { message: "Failed to fetch user info" },
      { status: 400 }
    );
  }

  const googleUser = await userResponse.json();

  let user = await UserRepository.findByProvider("google", googleUser.sub);

  if (user) {
    const jwt = await signToken(user.id);
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(AUTH_COOKIE, jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRY,
    });
    return response;
  }

  const existingEmailUser = await UserRepository.findByEmail(googleUser.email);

  if (existingEmailUser) {
    const jwt = await signToken(existingEmailUser.id);
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(AUTH_COOKIE, jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRY,
    });
    return response;
  }

  user = await UserRepository.create({
    name: googleUser.name,
    email: googleUser.email,
    provider: "google",
    providerId: googleUser.sub,
  });

  const jwt = await signToken(user.id);
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(AUTH_COOKIE, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY,
  });

  return response;
}
