import { pusher } from "./pusher";

export async function broadcastTripUpdate(
  tripId: string,
  event: string,
  data: Record<string, unknown>
) {
  try {
    await pusher.trigger(`trip-${tripId}`, event, data);
  } catch (err) {
    console.error("Pusher broadcast error:", err);
  }
}

export async function broadcastUserNotification(
  userId: string,
  notification: Record<string, unknown>
) {
  try {
    await pusher.trigger(`notification-${userId}`, "notification:new", {
      notification,
    });
  } catch (err) {
    console.error("Pusher user notification error:", err);
  }
}
