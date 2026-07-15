import { Map } from "@/components/map/mapbox";

export default async function TripPage() {
  return (
    <div className="space-y-6">
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
