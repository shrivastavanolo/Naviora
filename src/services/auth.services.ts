import bcrypt from "bcryptjs";

import { UserRepository } from "@/src/repositories/user.repository";
import type { SignupInput, LoginInput } from "@/src/schemas/auth";
import { ConflictError, UnauthorizedError } from "@/src/lib/errors";
import { signVerificationToken } from "@/src/lib/auth";

export class AuthService {
  static async signup(data: SignupInput) {
    const existingUser = await UserRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
      provider: "email",
    });

    const token = await signVerificationToken(user.id);
    this.sendVerificationEmail(user.name, user.email, token).catch(() => {});

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  static async sendVerificationEmail(
    name: string,
    email: string,
    token: string
  ) {
    const { Resend } = await import("resend");
    const { getEnv } = await import("@/src/config/env");

    const env = getEnv();
    if (!env.RESEND_API_KEY) return;

    const resend = new Resend(env.RESEND_API_KEY);
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verifyUrl = `${origin}/api/auth/verify?token=${token}`;

    await resend.emails.send({
      from: "Naviora <onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      html: `<p>Hi ${name},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });
  }
}
