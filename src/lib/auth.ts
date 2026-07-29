import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "@/src/config/env";

export async function signToken(userId: string) {
  const env = getEnv();
  const secret = new TextEncoder().encode(env.JWT_SECRET!);

  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const env = getEnv();
  const secret = new TextEncoder().encode(env.JWT_SECRET!);

  const { payload } = await jwtVerify(token, secret);

  return payload.sub;
}
