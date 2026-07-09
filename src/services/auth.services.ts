import bcrypt from "bcryptjs";

import { UserRepository } from "@/src/repositories/user.repository";
import type { SignupInput, LoginInput } from "@/src/schemas/auth";
import { ConflictError, UnauthorizedError } from "@/src/lib/errors";

export class AuthService {
  static async signup(data: SignupInput) {
    // 1. Check if user already exists
    const existingUser = await UserRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // 3. Create user
    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    // 4. Never return the password
    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }
}
