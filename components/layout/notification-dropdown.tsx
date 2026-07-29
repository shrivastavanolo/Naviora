"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import Image from "next/image";

import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/use-notifications";
import { useNotificationChannel } from "@/hooks/use-notification-channel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationDropdown() {
  const router = useRouter();
  const { data: unreadData } = useUnreadCount();
  const { data: notifData } = useNotifications(1, 10);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  useNotificationChannel();

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notifData?.notifications ?? [];

  const handleClick = useCallback(
    (n: (typeof notifications)[0]) => {
      if (!n.read) {
        markAsRead.mutate(n.id);
      }
      if (n.tripId) {
        router.push(`/trips/${n.tripId}`);
      }
    },
    [markAsRead, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex items-center justify-center rounded-full p-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-8">
            <Image
              src="/assets/illustrations/empty-notifications.svg"
              alt="No notifications"
              width={192}
              height={192}
              className="size-28"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-0.5 px-3 py-2.5 ${
                !n.read ? "bg-primary/5" : ""
              }`}
              onClick={() => handleClick(n)}
            >
              <div className="flex w-full items-start gap-2">
                {!n.read && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {n.body}
                    </p>
                  )}
                </div>
              </div>
              <p className="ml-4 text-[10px] text-muted-foreground">
                {formatTime(n.createdAt)}
              </p>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
