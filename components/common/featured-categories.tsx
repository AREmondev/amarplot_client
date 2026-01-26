"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, MapPin, Users, ArrowRight, TrendingUp } from "lucide-react"

const categories = [
  {
    id: "land",
    title: "Land",
    description: "Agricultural and commercial land plots",
    icon: MapPin,
    count: "2.5K+",
    trend: "+12%",
    color: "bg-green-500",
    href: "/search?type=land",
  },
  {
    id: "flat",
    title: "Flats",
    description: "Residential apartments and flats",
    icon: Building2,
    count: "4.2K+",
    trend: "+8%",
    color: "bg-blue-500",
    href: "/search?type=flat",
  },
  {
    id: "plot",
    title: "Plots",
    description: "Residential and commercial plots",
    icon: Home,
    count: "3.1K+",
    trend: "+15%",
    color: "bg-purple-500",
    href: "/search?type=plot",
  },
  {
    id: "mess",
    title: "Mess Spaces",
    description: "Student and working professional mess",
    icon: Users,
    count: "850+",
    trend: "+22%",
    color: "bg-orange-500",
    href: "/search?type=mess",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            🏘️ Property Categories
          </Badge>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">Explore by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect property type that matches your needs. From residential flats to commercial land.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Card className="group hover:shadow-cardHover transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${category.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex items-center text-sm text-accent font-medium">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {category.trend}
                      </div>
                    </div>

                    <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">{category.count}</div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-heading text-lg font-semibold mb-2">Buy Property</h3>
              <p className="text-sm text-muted-foreground mb-4">Find your dream property to purchase</p>
              <Link href="/search?category=buy" className="text-primary font-medium hover:underline">
                Browse Properties →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-heading text-lg font-semibold mb-2">Rent Property</h3>
              <p className="text-sm text-muted-foreground mb-4">Find rental properties in your area</p>
              <Link href="/search?category=rent" className="text-accent font-medium hover:underline">
                View Rentals →
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-heading text-lg font-semibold mb-2">Sell Property</h3>
              <p className="text-sm text-muted-foreground mb-4">List your property for sale</p>
              <Link href="/add-property" className="text-orange-600 font-medium hover:underline">
                List Property →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
