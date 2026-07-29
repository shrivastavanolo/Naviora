"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X, Mail, UserPlus, ChevronDown, ChevronUp } from "lucide-react";

import { useMe } from "@/hooks/use-auth";
import {
  useInviteMember,
  usePendingInvitations,
  useCancelInvitation,
} from "@/hooks/use-invitations";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Trip } from "@/src/types/trip";

interface MemberListProps {
  trip: Trip;
}

export default function MemberList({ trip }: MemberListProps) {
  const { data: currentUser } = useMe();
  const queryClient = useQueryClient();
  const isOwner = currentUser?.id === trip.ownerId;

  const [showInvite, setShowInvite] = useState(false);
  const [showPending, setShowPending] = useState(true);
  const [email, setEmail] = useState("");

  const inviteMutation = useInviteMember(trip.id);
  const cancelInviteMutation = useCancelInvitation(trip.id);
  const { data: pendingInvites } = usePendingInvitations(trip.id);

  const removeMutation = useMutation({
    mutationFn: (memberId: string) =>
      api(`/trips/${trip.id}/members/${memberId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", trip.id] });
      toast.success("Member removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    inviteMutation.mutate(email, {
      onSuccess: () => {
        toast.success("Invitation sent!");
        setEmail("");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Members{" "}
          <span className="text-muted-foreground font-normal">
            {trip.members.length}
          </span>
        </h3>
      </div>

      <div className="space-y-2">
        {trip.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-2 rounded-lg border bg-background p-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {initials(member.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.user.name}
                </p>
                {member.role === "OWNER" && (
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                    Owner
                  </span>
                )}
              </div>
            </div>

            {isOwner && member.userId !== currentUser?.id && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeMutation.mutate(member.userId)}
                disabled={removeMutation.isPending}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {isOwner && (
        <div className="space-y-3">
          {showInvite ? (
            <form onSubmit={handleInvite} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                  className="h-8 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? "Sending..." : "Send"}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </form>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowInvite(true)}
            >
              <UserPlus className="mr-2 size-4" />
              Invite Member
            </Button>
          )}

          {pendingInvites && pendingInvites.length > 0 && (
            <div className="rounded-lg border bg-background">
              <button
                type="button"
                onClick={() => setShowPending(!showPending)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>
                  Pending invitations{" "}
                  <span className="font-normal">({pendingInvites.length})</span>
                </span>
                {showPending ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
              {showPending && (
                <div className="space-y-1 px-3 pb-2">
                  {pendingInvites.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5 text-sm"
                    >
                      <Mail className="size-3 text-muted-foreground shrink-0" />
                      <span className="truncate text-muted-foreground text-xs flex-1">
                        {inv.inviteeEmail}
                      </span>
                      <span className="text-[10px] text-muted-foreground mr-1">
                        Pending
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => cancelInviteMutation.mutate(inv.id)}
                        disabled={cancelInviteMutation.isPending}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
