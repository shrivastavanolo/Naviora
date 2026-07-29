"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMe } from "@/hooks/use-auth";
import { AuthApi } from "@/client/auth";

export function EmailVerificationBanner() {
  const { data: user } = useMe();

  const resendMutation = useMutation({
    mutationFn: AuthApi.resendVerification,
    onSuccess: () => {
      toast.success("Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (!user || user.emailVerified || user.provider !== "email") {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 border-b border-border/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
      <span>Please verify your email address.</span>
      <button
        onClick={() => resendMutation.mutate()}
        disabled={resendMutation.isPending}
        className="font-medium underline underline-offset-2 transition-colors hover:text-amber-300 disabled:opacity-50"
      >
        {resendMutation.isPending ? "Sending..." : "Resend verification email"}
      </button>
    </div>
  );
}
