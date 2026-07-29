import { api } from "@/lib/api";

export interface Invitation {
  id: string;
  tripId: string;
  inviterId: string;
  inviteeEmail: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  createdAt: string;
  inviter: { id: string; name: string };
  trip?: { id: string; title: string };
}

export const InvitationApi = {
  inviteByEmail(tripId: string, email: string) {
    return api<Invitation>(`/trips/${tripId}/invitations`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  getPendingByTrip(tripId: string) {
    return api<Invitation[]>(`/trips/${tripId}/invitations`);
  },

  getInvitation(token: string) {
    return api<Invitation>(`/invitations/${token}`);
  },

  respond(token: string, action: "accept" | "decline") {
    return api<Invitation>(`/invitations/${token}`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  },

  cancelInvitation(tripId: string, invitationId: string) {
    return api<{ id: string }>(`/trips/${tripId}/invitations/${invitationId}`, {
      method: "DELETE",
    });
  },
};
