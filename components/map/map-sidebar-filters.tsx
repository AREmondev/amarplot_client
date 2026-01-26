"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MapPin, Filter, Search, Zap, TrendingUp } from "lucide-react"
import { NEIGHBORHOODS, PROPERTY_TYPES } from "@/lib/constants"

export function MapSidebarFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const popularAreas = [
    { name: "Gulshan", count: 245, trend: "+12%" },
    { name: "Dhanmondi", count: 189, trend: "+8%" },
    { name: "Uttara", count: 156, trend: "+15%" },
    { name: "Banani", count: 134, trend: "+5%" },
    { name: "Mirpur", count: 98, trend: "+22%" },
  ]

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <Card className="h-full rounded-none border-r">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2" />
          Map Filters
        </CardTitle>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <CardContent className="space-y-6">
          {/* Quick Search */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Search className="h-4 w-4 mr-2" />
              Quick Search
            </Label>
            <Input placeholder="Search area, landmark, or property..." />
          </div>

          <Separator />

          {/* Popular Areas */}
          <div className="space-y-3">
            <Label className="flex items-center text-sm font-medium">
              <MapPin className="h-4 w-4 mr-2" />
              Popular Areas
            </Label>
            <div className="space-y-2">
              {NEIGHBORHOODS.slice(0, 5).map((area, index) => {
                const areaData = popularAreas[index] || { count: 0, trend: "+0%" };
                return (
                  <div
                    key={area.value}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedAreas((prev) =>
                        prev.includes(area.value) ? prev.filter((a) => a !== area.value) : [...prev, area.value],
                      )
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={selectedAreas.includes(area.value)} />
                      <span className="text-sm">{area.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {areaData.count}
                      </Badge>
                      <div className="flex items-center text-xs text-accent">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {areaData.trend}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Property Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Property Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={2000000}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="flex gap-2">
              {["Buy", "Rent", "Sell"].map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Features</Label>
            <div className="space-y-2">
              {[
                "Verified Properties",
                "Hot Deals",
                "Urgent Sales",
                "Furnished",
                "New Construction",
                "Ready to Move",
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox id={feature} />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Clear All
            </Button>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
