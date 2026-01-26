
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, MapPin, DollarSign, Building, Square, BedDouble, Bath, Calendar } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"

interface ReviewPublishStepProps {
  handleStepClick: (step: number) => void
}

export function ReviewPublishStep({ handleStepClick }: ReviewPublishStepProps) {
  const { watch } = useFormContext<ListingFormData>()
  const formData = watch()

  const propertyType = formData.property_type;
  const isResidential = propertyType === "Flat" || propertyType === "House" || propertyType === "Mess";

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "N/A";
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
        return `BDT ${(price / 100000).toFixed(2)} Lac`
      }
    return `BDT ${price.toLocaleString()}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Eye className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h2>
        <p className="text-gray-600">Review your listing before publishing.</p>
      </div>
      <Card className="overflow-hidden">
        {formData.images && formData.images.length > 0 && (
          <img src={formData.images[0]} alt={formData.title || 'Property Image'} className="w-full h-64 object-cover" />
        )}
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold">{formData.title}</h3>
              <p className="text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-2" />{formData.location?.address}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleStepClick(1)}>Edit</Button>
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary"/><div><span className="font-semibold">Price:</span> {formatPrice(formData.price)}</div></div>
            <div className="flex items-center gap-2"><Building className="w-4 h-4 text-primary"/><div><span className="font-semibold">Type:</span> {formData.property_type}</div></div>
            <div className="flex items-center gap-2"><Square className="w-4 h-4 text-primary"/><div><span className="font-semibold">Size:</span> {formData.size}</div></div>
            {isResidential && (
              <>
                <div className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-primary"/><div><span className="font-semibold">Bedrooms:</span> {formData.bedrooms}</div></div>
                <div className="flex items-center gap-2"><Bath className="w-4 h-4 text-primary"/><div><span className="font-semibold">Bathrooms:</span> {formData.bathrooms}</div></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/><div><span className="font-semibold">Year Built:</span> {formData.year_built}</div></div>
              </>
            )}
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600">{formData.description}</p>
          </div>
          {isResidential && formData.amenities && formData.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map(amenity => <div key={amenity} className="bg-muted px-2 py-1 rounded-full text-xs">{amenity}</div>)}
                </div>
              </div>
            </>
          )}
          {formData.nearby_places && formData.nearby_places.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Nearby Places</h4>
                <div className="space-y-2">
                  {formData.nearby_places.map((place, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{place.name} ({place.category})</span>
                      <span>{place.distance} km</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold mb-2">Legal Information</h4>
              <p className="text-gray-600"><span className="font-semibold">Status:</span> {formData.legal_verification?.status}</p>
              <p className="text-gray-600"><span className="font-semibold">Details:</span> {formData.legal_verification?.details}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleStepClick(6)}>Edit</Button>
          </div>
          <Separator />
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-gray-600"><span className="font-semibold">Phone:</span> {formData.contact?.phone}</p>
              <p className="text-gray-600"><span className="font-semibold">Email:</span> {formData.contact?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleStepClick(7)}>Edit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
