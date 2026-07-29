"use client";

import { useTripActivity } from "@/hooks/use-trip-activity";
import LoadingSpinner from "@/components/ui/spinner";

const ACTION_LABELS: Record<string, string> = {
  place_added: "added a place",
  place_updated: "updated a place",
  place_deleted: "removed a place",
  places_reordered: "reordered places",
  day_created: "added a day",
  day_updated: "renamed a day",
  day_deleted: "removed a day",
  trip_updated: "updated trip details",
  member_joined: "joined the trip",
};

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

interface ActivityLogProps {
  tripId: string;
}

export default function ActivityLog({ tripId }: ActivityLogProps) {
  const { data, isLoading } = useTripActivity(tripId);

  if (isLoading) return <LoadingSpinner />;

  const logs = data?.logs ?? [];

  if (!logs.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-3 rounded-lg p-3 text-sm"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {entry.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p>
              <span className="font-medium">{entry.user.name}</span>{" "}
              {ACTION_LABELS[entry.action] ?? entry.action}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTime(entry.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
