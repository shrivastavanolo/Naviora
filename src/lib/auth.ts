import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "@/src/config/env";

function getSecret() {
  const env = getEnv();
  return new TextEncoder().encode(env.JWT_SECRET!);
}

export async function signToken(userId: string) {
  const secret = getSecret();

  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const secret = getSecret();

  const { payload } = await jwtVerify(token, secret);

  return payload.sub;
}

export async function signVerificationToken(userId: string) {
  const secret = getSecret();

  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyVerificationToken(token: string) {
  const secret = getSecret();

  const { payload } = await jwtVerify(token, secret);

  return payload.sub as string;
}
