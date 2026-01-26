// components/property/property-details-page.tsx
"use client";

import { useEffect, useState } from "react";
import { propertiesService, Property } from "@/lib/api/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Share2, ShieldCheck, Banknote, Eye, BarChart } from "lucide-react";
import { useRouter } from "next/navigation";

// Import the new components
import PropertyHeader from "./property-header";
import PropertyImageGallery from "./property-image-gallery";
import PropertyOverview from "./property-overview";
import PropertyDescription from "./property-description";
import PropertyFeaturesAmenities from "./property-features-amenities";
import PropertyNearbyPlaces from "./property-nearby-places";
import SavePropertyButton from "./save-property-button"; // Ensure this is imported
import { PropertyInstallmentDetails } from "./property-installment-details";
import { PropertyOwnerProfile } from "./property-owner-profile";
import { LoadingScreen } from "../common/loading-screen";

interface PropertyDetailsPageProps {
  propertyId: string;
}

export function PropertyDetailsPage({ propertyId }: PropertyDetailsPageProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy installment data since API doesn't have this yet
  const dummyInstallmentData = {
    available: true,
    duration_months: 24,
    down_payment_percentage: 30,
    monthly_amount: 75000,
    service_details: "Our installment service offers flexible payment options with competitive rates. Processing fee of 2% applies on the total amount. Early payment discounts available.",
    terms_and_conditions: "1. Down payment must be made within 7 days of agreement. 2. Monthly payments due on the 1st of each month. 3. Late payment penalty of 2% per month applies. 4. Early settlement discount of 5% available after 12 months. 5. All payments are non-refundable."
  };

  useEffect(() => {
    const getPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await propertiesService.getPropertyById(propertyId);
        setProperty(response.data);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      getPropertyDetails();
    }
  }, [propertyId]);

  if (loading) {
    return (
     <LoadingScreen/>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center text-red-500">{error}</CardContent>
        </Card>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center">Property not found.</CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="container py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyHeader property={property} />
          <PropertyImageGallery images={property.images} title={property.title} />

          <PropertyOverview property={property} />
          <PropertyDescription description={property.description} />

          <PropertyFeaturesAmenities property={property} />
          <PropertyNearbyPlaces nearbyFacilities={property.nearby_facilities} />

          {/* Installment Details */}
          <PropertyInstallmentDetails 
            installment={property.installment || dummyInstallmentData} 
            totalPrice={property.price || 0} 
          />

          {/* Legal & Financials */}
          {(property.legal_verification || property.price) && (
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle>Legal & Financials</CardTitle></CardHeader>
              <CardContent>
                  {property.legal_verification && (
                      <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <div>
                              <strong>Legal Status:</strong> {property.legal_verification.status}
                          </div>
                      </div>
                  )}
                  {property.legal_verification?.details && (
                      <p className="text-muted-foreground text-sm mb-4"> {property.legal_verification.details}</p>
                  )}
                  {/* Assuming mortgage_estimate is part of property if needed */}
                  {/* {property.mortgage_estimate && <div className="flex items-center gap-2"><Banknote className="h-5 w-5 text-primary" /> <div><strong>Mortgage:</strong> Starting from {formatPrice(property.mortgage_estimate.monthly_payment)}/month</div></div>} */}
              </CardContent>
            </Card>
          )}

          {/* Location Map - Placeholder for now, assuming coordinates are numbers */}
          {property.location?.coordinates && (
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle>Location on Map</CardTitle></CardHeader>
              <CardContent>
                {/* You would integrate a map component here, e.g., Google Maps, Leaflet */}
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-muted-foreground">
                  Map integration placeholder for {property.location.coordinates.latitude}, {property.location.coordinates.longitude}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-24">
          {/* Owner Profile */}
          <PropertyOwnerProfile contactInfo={property.contact} />
          
          {/* Action Card */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-2 mb-4">
                <SavePropertyButton propertyId={property._id} />
                <Button variant="outline" className="flex-1"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
              </div>
              <div className="space-y-3">
                {property.contact?.phone && (
                  <Button className="w-full" size="lg" onClick={() => window.location.href = `tel:${property.contact?.phone}`}>
                    <Phone className="h-4 w-4 mr-2" /> {property.contact.phone}
                  </Button>
                )}
                {property.contact?.email && (
                  <Button onClick={() => router.push(`/chat?propertyId=${property._id}&contactEmail=${property.contact?.email}`)} variant="outline" className="w-full bg-transparent" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>
  );
}
