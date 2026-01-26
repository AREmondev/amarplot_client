
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sparkles } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"
import { NearbyPlacesForm } from "@/components/property/nearby-places-form"

export function FeaturesAmenitiesStep() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<ListingFormData>()
  const formData = watch()

  const propertyType = formData.property_type;
  const isResidential = propertyType === "Flat" || propertyType === "House" || propertyType === "Mess";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Sparkles className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Features & Amenities</h2>
        <p className="text-gray-600">Highlight the best features of your property.</p>
      </div>
      {isResidential && (
        <div>
          <Label htmlFor="amenities">Amenities</Label>
          <Input id="amenities" placeholder="e.g., Parking, Lift, Security" {...register("amenities", {
            setValueAs: (value) => String(value || "").split(",").map((item: string) => item.trim()),
          })} />
          {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities.message}</p>}
        </div>
      )}
      <div>
        <Label htmlFor="eco_features">Eco Features</Label>
        <Input id="eco_features" placeholder="e.g., Solar Panels, Rainwater Harvesting" {...register("eco_features", {
            setValueAs: (value) => String(value || "").split(",").map((item: string) => item.trim()),
          })} />
        {errors.eco_features && <p className="text-red-500 text-sm">{errors.eco_features.message}</p>}
      </div>
      {isResidential && (
        <div>
          <Label htmlFor="smart_features">Smart Features</Label>
          <Input id="smart_features" placeholder="e.g., Wi-Fi Locks, Smart Thermostat" {...register("smart_features", {
            setValueAs: (value) => String(value || "").split(",").map((item: string) => item.trim()),
          })} />
          {errors.smart_features && <p className="text-red-500 text-sm">{errors.smart_features.message}</p>}
        </div>
      )}
      <Separator className="my-6" />
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Nearby Places & Transportation</h3>
        <NearbyPlacesForm
          value={formData.nearby_places || []}
          onChange={(places) => setValue("nearby_places", places)}
        />
        {errors.nearby_places && <p className="text-red-500 text-sm">{errors.nearby_places.message}</p>}
      </div>
    </div>
  )
}
