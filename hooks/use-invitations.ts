import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InvitationApi } from "@/client/invitation";
import { toast } from "sonner";

export function usePendingInvitations(tripId: string) {
  return useQuery({
    queryKey: ["invitations", tripId],
    queryFn: () => InvitationApi.getPendingByTrip(tripId),
    enabled: !!tripId,
  });
}

export function useInviteMember(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => InvitationApi.inviteByEmail(tripId, email),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", tripId] });
    },
  });
}

export function useInvitation(token: string) {
  return useQuery({
    queryKey: ["invitation", token],
    queryFn: () => InvitationApi.getInvitation(token),
    enabled: !!token,
  });
}

export function useRespondInvitation(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "accept" | "decline") =>
      InvitationApi.respond(token, action),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitation", token] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useCancelInvitation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      InvitationApi.cancelInvitation(tripId, invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", tripId] });
      toast.success("Invitation cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
