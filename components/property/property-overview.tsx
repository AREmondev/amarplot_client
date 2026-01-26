// components/property/property-overview.tsx

import { Property } from "@/lib/api/property";
import { Bed, Bath, Ruler, MapPin, Calendar, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyOverviewProps {
  property: Property;
}

export default function PropertyOverview({ property }: PropertyOverviewProps) {
  const overviewItems = [
    { icon: <Bed className="h-5 w-5 text-primary" />, label: "Bedrooms", value: property.bedrooms },
    { icon: <Bath className="h-5 w-5 text-primary" />, label: "Bathrooms", value: property.bathrooms },
    { icon: <Ruler className="h-5 w-5 text-primary" />, label: "Size", value: property.size },
    { icon: <MapPin className="h-5 w-5 text-primary" />, label: "Property Type", value: property.property_type },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Transaction Type", value: property.transaction_type },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Year Built", value: property.year_built || 'N/A' },
    { icon: <Compass className="h-5 w-5 text-primary" />, label: "Facing", value: property.facing_direction || 'N/A' },
  ];

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/40 rounded-lg">
              {item.icon}
              <div>
                <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                <div className="text-lg font-semibold">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
