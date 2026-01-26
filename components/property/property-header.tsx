// components/property/property-header.tsx
"use client";

import { Property } from "@/lib/api/property";
import { MapPin } from "lucide-react";
import SavePropertyButton from "./save-property-button";

interface PropertyHeaderProps {
  property: Property;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
        return `BDT ${(price / 100000).toFixed(2)} Lac`;
      }
    return `BDT ${price.toLocaleString()}`;
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location.address}
        </div>
        {/* TagBadges could be adapted for new data */}
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-primary mb-1">
          {/*  */}
          {property.price ? formatPrice(property.price) : "Contact for price"}
        </div>
        <div className="text-sm text-muted-foreground">
          {property.transaction_type === "Rent" ? "per month" : "total price"}
        </div>
      </div>
      {/* <div className="mt-4 md:mt-0">
        <SavePropertyButton propertyId={property._id} />
      </div> */}
    </div>
  );
}
