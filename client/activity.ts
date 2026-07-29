import { api } from "@/lib/api";

export interface ActivityLogEntry {
  id: string;
  tripId: string;
  userId: string;
  action: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ActivityLogResponse {
  logs: ActivityLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export const ActivityApi = {
  getLogs(tripId: string, page = 1, limit = 20) {
    return api<ActivityLogResponse>(`/trips/${tripId}/activity?page=${page}&limit=${limit}`);
  },
};
