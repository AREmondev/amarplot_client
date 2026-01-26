"use client"

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, TrendingDown, Zap } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {  propertiesService, Property } from "@/lib/api/property"
import Link from "next/link"

const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
        return `BDT ${(price / 100000).toFixed(2)} Lac`
      }
    return `BDT ${price.toLocaleString()}`
  }

export default function HotDeals() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getHotDeals = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await propertiesService.getProperties({ limit: 3 })
        console.log("response", response.data.data)
        setProperties(response.data.data)
      } catch (err) {
        console.error("Error fetching hot deals:", err)
        setError("Failed to load hot deals. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getHotDeals()
  }, [])
  console.log(properties, "properties")

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center">Loading hot deals...</CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="p-6 text-center text-red-500">{error}</CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-orange-600" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Hot Deals</h2>
            <Zap className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Limited time offers with significant discounts. Act fast before they&apos;re gone!
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="group hover:shadow-cardHover transition-all duration-300 overflow-hidden border-2 border-orange-200 hover:border-red-300 bg-gradient-to-br from-white to-orange-50 cursor-pointer"
                onClick={() => router.push(`/property/${property._id}`)}
              >
                <div className="relative">
                  <Image
                    src={property.images?.[0] || "/placeholder.svg"}
                    alt={property.title || "Property Image"}
                    width={250}
                    height={150}
                    className="w-full h-40 object-cover"
                  />
                  {/* You might need to calculate discount or add a field for it in your schema */}
                  {property.isHotProduct && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Hot Deal
                    </Badge>
                  )}
                  {/* If you have a timeLeft field in your schema, display it here */}
                  {/* <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 shadow-md">
                    <div className="flex items-center text-xs text-red-600 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {deal.timeLeft}
                    </div>
                  </div> */}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>

                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location?.city}
                  </div>

                  <div className="mb-3">
                    {/* If you have originalPrice and discountedPrice, display them */}
                    <div className="text-2xl font-bold text-primary">{formatPrice(property.price!)}</div>
                  </div>

                  {/* If you have a reason field in your schema, display it here */}
                  {/* <div className="text-sm text-muted-foreground mb-4 italic">Reason: {deal.reason}</div> */}

                  <Button className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={() => router.push(`/property/${property._id}`)}>
                    <Zap className="mr-2 h-4 w-4" />
                    View Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">No hot deals found at the moment.</CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link href="/search?isHotProduct=true" passHref>
            <Button
              variant="outline"
              size="lg"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent cursor-pointer"
            >
              View All Hot Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
