"use client"

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { propertiesService } from "@/lib/api/property"
import { Property } from "@/types"

const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
        return `BDT ${(price / 100000).toFixed(2)} Lac`
      }
    return `BDT ${price.toLocaleString()}`
  }

export default function RecentlyAdded() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getRecentlyAddedProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await propertiesService.getProperties({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' })
        console.log("response", response.data.data)
        setProperties(response.data.data)
      } catch (err) {
        console.error("Error fetching recently added properties:", err)
        setError("Failed to load recently added properties.")
      } finally {
        setLoading(false)
      }
    }

    getRecentlyAddedProperties()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">Loading recently added properties...</CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center text-red-500">{error}</CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Recently Added</h2>
          <p className="text-muted-foreground">Fresh properties just added to our platform</p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/property/${property._id}`)}
              >
                <div className="relative">
                  <Image
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.title || "Property Image"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>

                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location?.address}, {property.location?.city}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                    )}
                    {property.size && (
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.size}
                      </div>
                    )}
                  </div>

                  <div className="text-xl font-bold text-primary">{formatPrice(property.price!)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">No recently added properties found.</CardContent>
          </Card>
        )}

        <div className="text-center mt-12">
            <Link href="/search" passHref>
                <Button variant="outline">View All Properties</Button>
            </Link>
        </div>
      </div>
    </section>
  )
}