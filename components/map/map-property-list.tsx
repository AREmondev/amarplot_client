"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MapPin, Bed, Bath, Square, Phone, MessageCircle, Eye, Verified, Clock } from "lucide-react"
import Link from "next/link"
import { Property } from "@/lib/api/property"

interface MapPropertyListProps {
  properties: Property[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
  }
  onPageChange: (page: number) => void
  onPropertySelect: (propertyId: string) => void
  selectedProperty: string | null
}

export function MapPropertyList({
  properties,
  loading,
  pagination,
  onPageChange,
  onPropertySelect,
  selectedProperty,
}: MapPropertyListProps) {
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set())

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  const toggleSaved = (propertyId: string) => {
    setSavedProperties((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId)
      } else {
        newSet.add(propertyId)
      }
      return newSet
    })
  }

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "flat":
        return "bg-blue-100 text-blue-800"
      case "plot":
        return "bg-green-100 text-green-800"
      case "land":
        return "bg-yellow-100 text-yellow-800"
      case "mess":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* List Header */}
      <div className="p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-base">Properties</h2>
            <p className="text-xs text-muted-foreground">{pagination.total} properties found</p>
          </div>
        </div>
      </div>

      {/* Property List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            properties.map((property) => (
              <Card
                key={property._id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedProperty === property._id ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => onPropertySelect(property._id)}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Property Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* Status Indicators */}
                      <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                        {property.isVerified && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Verified className="h-2 w-2 text-white" />
                          </div>
                        )}
                        {property.isUrgentSale && (
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <Clock className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm line-clamp-1 flex-1">{property.title}</h3>
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {property.property_type}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">{property.location.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Features Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-3 w-3 mr-1" />
                              {property.bedrooms}
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-3 w-3 mr-1" />
                              {property.bathrooms}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Square className="h-3 w-3 mr-1" />
                            {property.size}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-sm text-primary">{formatPrice(property.price)}</div>
                          <div className="text-xs text-muted-foreground">
                            {property.transaction_type === "Rent" ? "/mo" : ""}
                          </div>
                        </div>
                      </div>


                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      {/* Pagination */}
      <div className="p-4 border-t flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
