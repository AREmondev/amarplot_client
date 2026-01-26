"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import { ROOM_OPTIONS, PROPERTY_TYPES, CITIES } from "@/lib/constants"

export default function ListingFilters() {
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [bedrooms, setBedrooms] = useState("any")
  const [bathrooms, setBathrooms] = useState("any")

  // Using centralized constants instead of hardcoded arrays

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type])
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Type */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Property Type</Label>
            <div className="space-y-2">
              {PROPERTY_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                  />
                  <Label htmlFor={type.value} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000000}
              min={0}
              step={100000}
              className="w-full"
            />
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Location</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.slice(0, 5).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Area (sq ft)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min" type="number" />
              <Input placeholder="Max" type="number" />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button className="w-full">Apply Filters</Button>
            <Button variant="outline" className="w-full bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
