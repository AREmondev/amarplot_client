// components/listings/listing-grid.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: { city: string; neighborhood: string };
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  property_type: string;
  transaction_type: string;
  // Add other fields you want to display
}

interface ListingGridProps {
  properties: Property[];
}

export default function ListingGrid({ properties }: ListingGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property._id} className="flex flex-col">
          <CardHeader className="p-0">
            <Link href={`/property/${property._id}`}>
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={property.images[0] || "/placeholder.jpg"} // Use a placeholder if no image
                  alt={property.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
              <Link href={`/property/${property._id}`} className="hover:underline">
                {property.title}
              </Link>
            </CardTitle>
            <p className="text-xl font-bold text-primary mb-2">₹{property.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {property.bedrooms} Beds | {property.bathrooms} Baths | {property.location.city}
            </p>
            <p className="text-sm text-muted-foreground">
              {property.property_type} for {property.transaction_type}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/property/${property._id}`} className="w-full">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}