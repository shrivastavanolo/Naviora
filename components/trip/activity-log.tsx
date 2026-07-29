"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTripActivity } from "@/hooks/use-trip-activity";
import LoadingSpinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

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
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading } = useTripActivity(tripId, page, limit);

  if (isLoading) return <LoadingSpinner />;

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data ? Math.ceil(total / limit) : 0;

  if (!logs.length) {
    return (
      <div className="flex flex-col items-center py-8">
        <img
          src="/assets/illustrations/empty-notifications.svg"
          alt="No activity"
          className="size-28"
        />
        <p className="mt-3 text-sm text-muted-foreground">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Activity
      </h3>
      <div className="space-y-1">
        {logs.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-2 rounded-lg p-2 text-sm"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              {entry.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-snug">
                <span className="font-medium">{entry.user.name}</span>{" "}
                {ACTION_LABELS[entry.action] ?? entry.action}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatTime(entry.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
