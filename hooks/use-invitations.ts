import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InvitationApi } from "@/client/invitation";

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
