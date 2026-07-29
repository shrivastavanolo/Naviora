"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { useInvitation, useRespondInvitation } from "@/hooks/use-invitations";
import { useMe } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/spinner";

export default function InvitationPage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const { data: invitation, isLoading, error } = useInvitation(token);
  const { data: user, isLoading: authLoading } = useMe();
  const respondMutation = useRespondInvitation(token);

  const handleAccept = useCallback(() => {
    respondMutation.mutate("accept", {
      onSuccess: (data) => {
        const tripId = (data as unknown as { member: { tripId: string } })
          ?.member?.tripId;
        toast.success("You've joined the trip!");
        if (tripId) router.push(`/trips/${tripId}`);
        else router.push("/dashboard");
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });
  }, [respondMutation, router]);

  const handleDecline = useCallback(() => {
    respondMutation.mutate("decline", {
      onSuccess: () => {
        toast.success("Invitation declined");
        router.push("/dashboard");
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });
  }, [respondMutation, router]);

  if (isLoading || authLoading) return <LoadingSpinner />;

  if (error || !invitation) {
    return (
      <main className="mx-auto max-w-lg p-8 text-center">
        <Image
          src="/assets/illustrations/empty-invite.svg"
          alt="Invalid invitation"
          className="mx-auto mb-6 size-44"
        />
        <h1 className="text-2xl font-bold">Invitation not found</h1>
        <p className="mt-2 text-muted-foreground">
          This invitation link is invalid or has expired.
        </p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-lg p-8 text-center">
        <Image
          src="/assets/illustrations/empty-invite.svg"
          alt="Sign in required"
          className="mx-auto mb-6 size-44"
        />
        <h1 className="text-2xl font-bold">Sign in to accept</h1>
        <p className="mt-2 text-muted-foreground">
          You need to sign in to accept this invitation.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push(`/login?redirect=/invitations/${token}`)}
        >
          Sign In
        </Button>
      </main>
    );
  }

  if (invitation.status !== "PENDING") {
    return (
      <main className="mx-auto max-w-lg p-8 text-center">
        <Image
          src="/assets/illustrations/empty-invite.svg"
          alt="Invitation processed"
          className="mx-auto mb-6 size-44"
        />
        <h1 className="text-2xl font-bold">
          Invitation {invitation.status.toLowerCase()}
        </h1>
        <p className="mt-2 text-muted-foreground">
          This invitation has already been {invitation.status.toLowerCase()}.
        </p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg p-8 text-center">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Trip Invitation</h1>
          <p className="mt-2 text-muted-foreground">
            <span className="font-medium text-foreground">
              {invitation.inviter.name}
            </span>{" "}
            has invited you to join{" "}
            <span className="font-medium text-foreground">
              {invitation.trip?.title ?? "a trip"}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleAccept}
            disabled={respondMutation.isPending}
          >
            {respondMutation.isPending ? "Accepting..." : "Accept"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleDecline}
            disabled={respondMutation.isPending}
          >
            Decline
          </Button>
        </div>
      </div>
    </main>
  );
}
