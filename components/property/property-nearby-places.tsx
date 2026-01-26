// components/property/property-nearby-places.tsx

import { Property } from "@/lib/api/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyNearbyPlacesProps {
  nearbyFacilities?: { name: string; type: string; distance: string }[];
}

export default function PropertyNearbyPlaces({ nearbyFacilities }: PropertyNearbyPlacesProps) {
  if (!nearbyFacilities || nearbyFacilities.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Nearby Places</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-muted-foreground">
          {nearbyFacilities.map((place, index) => (
            <li key={index}>{place.name} ({place.type}) - {place.distance}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
