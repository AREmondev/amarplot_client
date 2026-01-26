// components/property/property-features-amenities.tsx

import { Property } from "@/lib/api/property";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PropertyFeaturesAmenitiesProps {
  property: Property;
}

export default function PropertyFeaturesAmenities({ property }: PropertyFeaturesAmenitiesProps) {
  const hasFeatures = property.amenities?.length > 0;

  if (!hasFeatures) {
    return null;
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {property.amenities?.map((amenity, index) => (
            <Badge key={index} variant="secondary">{amenity}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
