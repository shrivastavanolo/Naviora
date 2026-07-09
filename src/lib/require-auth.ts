import { cookies } from "next/headers";

import { verifyToken } from "./auth";
import { UserRepository } from "@/src/repositories/user.repository";
import { UnauthorizedError } from "./errors";

export async function requireAuth() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new UnauthorizedError("Not authenticated");
  }

  const userId = await verifyToken(token);

  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }

  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
}