import { SignJWT, jwtVerify } from "jose";
import { env } from "@/src/config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET!);

export async function signToken(userId: string) {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return payload.sub;
}
