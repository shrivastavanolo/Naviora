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
