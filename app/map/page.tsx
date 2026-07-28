import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Map } from "@/components/map/mapbox";

export default async function TripPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>
      <h1 className="text-3xl font-bold">Trip Map</h1>

      <Map
        markers={[
          {
            id: "1",
            latitude: 35.6764,
            longitude: 139.65,
          },
          {
            id: "2",
            latitude: 35.7101,
            longitude: 139.8107,
          },
        ]}
      />
    </div>
  );
}
