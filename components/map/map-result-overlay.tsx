"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Eye, Heart, Share2, MapPin, Bed, Bath, Square, DollarSign, Building } from "lucide-react"
import Link from "next/link"

interface MapResultOverlayProps {
  property: any // This should ideally be a more specific type like Listing
  onClose: () => void
}

export function MapResultOverlay({ property, onClose }: MapResultOverlayProps) {
  const formatPrice = (price: number, category: string) => {
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
        return `BDT ${(price / 100000).toFixed(2)} Lac`
      }
    return `BDT ${price.toLocaleString()}`
  }

  return (
    <Card className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-xl">
      <div className="relative flex-shrink-0">
        <img
          src={property.images?.[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />

        {/* Close Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {property.verified && (
            <Badge className="bg-green-500 text-white">Verified</Badge>
          )}
          {property.urgent && (
            <Badge className="bg-red-500 text-white">Urgent</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 pr-2">{property.title}</h3>
          <div className="text-xl font-bold text-primary ml-auto whitespace-nowrap">
            {formatPrice(property.price, property.category)}
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
          {property.beds && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.beds} BR</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.baths} BA</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area} sq ft</span>
            </div>
          )}
          {property.property_type && (
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span className="capitalize">{property.property_type}</span>
            </div>
          )}
          {property.transaction_type && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="capitalize">{property.transaction_type}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
          {property.description}
        </p>

        <div className="flex gap-2 mt-auto">
          <Button size="sm" asChild className="flex-1">
            <Link href={`/property/${property.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}