import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/require-auth";
import { signVerificationToken } from "@/src/lib/auth";
import { getErrorResponse } from "@/src/lib/error-handler";
import { Resend } from "resend";
import { getEnv } from "@/src/config/env";

export async function POST() {
  try {
    const user = await requireAuth();

    const env = getEnv();

    if (!env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 501 }
      );
    }

    const token = await signVerificationToken(user.id);
    const resend = new Resend(env.RESEND_API_KEY);

    const { origin } = new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );
    const verifyUrl = `${origin}/api/auth/verify?token=${token}`;

    await resend.emails.send({
      from: "Naviora <onboarding@resend.dev>",
      to: user.email,
      subject: "Verify your email address",
      html: `<p>Hi ${user.name},</p><p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = getErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
