"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DollarSign, Home, MapPin, Bed, Square, Shield, Clock, TrendingUp, RotateCcw, Building, Calendar, Compass, Wrench } from "lucide-react"
import {
  AMENITIES,
  FURNISHING_TYPES,
  CONSTRUCTION_STATUSES,
  FACING_DIRECTIONS,
  PROPERTY_CONDITIONS,
  MAP_SORT_OPTIONS,
} from "@/lib/constants"

interface AdvancedMapFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
}

export function AdvancedMapFilters({ filters, onFiltersChange }: AdvancedMapFiltersProps) {
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handlePropertyTypeChange = (type: string) => {
    const newPropertyTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter((t: string) => t !== type)
      : [...filters.propertyType, type]
    updateFilter("propertyType", newPropertyTypes)
  }

  const resetFilters = () => {
    onFiltersChange({
      minPrice: 0,
      maxPrice: 2500000,
      propertyType: ["Flat"],
      minBedrooms: null,
      maxBedrooms: null,
      minBathrooms: null,
      maxBathrooms: null,
      isFeatured: false,
      isHotProduct: false,
      isVerified: false,
      isUrgentSale: false,
      isFurnished: false,
      hasParking: false,
      isNewConstruction: false,
      isReadyToMove: false,
      furnishingType: null,
      amenities: [],
      minLotSize: null,
      maxLotSize: null,
      minFloorNumber: null,
      maxFloorNumber: null,
      minTotalFloors: null,
      maxTotalFloors: null,
      constructionStatus: null,
      minYearBuilt: null,
      maxYearBuilt: null,
      facingDirection: null,
      propertyCondition: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
      <div className="space-y-6 py-4">
        {/* Price Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 font-semibold">
              <DollarSign className="h-4 w-4" />
              Price Range
            </Label>
            <Button variant="ghost" size="sm" onClick={() => {
              updateFilter("minPrice", 0)
              updateFilter("maxPrice", 2500000)
            }}>
              Reset
            </Button>
          </div>
          <div className="px-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={(value) => {
                updateFilter("minPrice", value[0])
                updateFilter("maxPrice", value[1])
              }}
              max={2500000}
              min={0}
              step={50000}
              className="mb-3"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.minPrice)}</span>
            <span>{formatPrice(filters.maxPrice)}</span>
          </div>

          {/* Quick Price Ranges */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Under ₹5L", range: [0, 500000] },
              { label: "₹5L - ₹10L", range: [500000, 1000000] },
              { label: "₹10L - ₹20L", range: [1000000, 2000000] },
              { label: "Above ₹20L", range: [2000000, 2500000] },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  updateFilter("minPrice", preset.range[0])
                  updateFilter("maxPrice", preset.range[1])
                }}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Property Types */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Home className="h-4 w-4" />
            Property Types
          </Label>
          <div className="space-y-3">
            {["Flat", "House", "Land", "Plot", "Mess"].map((type) => (
              <div key={type} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={filters.propertyType.includes(type)}
                    onCheckedChange={() => handlePropertyTypeChange(type)}
                  />
                  <div>
                    <div className="font-medium capitalize">{type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bedrooms & Bathrooms */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Bed className="h-4 w-4" />
            Rooms
          </Label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Bedrooms</Label>
              <Select
                value={filters.minBedrooms?.toString() || "any"}
                onValueChange={(value) => updateFilter("minBedrooms", value !== "any" ? Number.parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Bathrooms</Label>
              <Select
                value={filters.minBathrooms?.toString() || "any"}
                onValueChange={(value) => updateFilter("minBathrooms", value !== "any" ? Number.parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Property Features */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Square className="h-4 w-4" />
            Features
          </Label>

          <div className="space-y-3">
            {[
              { key: "isVerified", label: "Verified Properties", icon: Shield },
              { key: "isUrgentSale", label: "Urgent Sales", icon: Clock },
              { key: "isFurnished", label: "Furnished", icon: Home },
              { key: "hasParking", label: "Parking Available", icon: Square },
              { key: "isNewConstruction", label: "New Construction", icon: TrendingUp },
              { key: "isReadyToMove", label: "Ready to Move", icon: Home },
            ].map((feature) => {
              const IconComponent = feature.icon
              return (
                <div key={feature.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{feature.label}</span>
                  </div>
                  <Switch
                    checked={filters[feature.key] || false}
                    onCheckedChange={(checked) => updateFilter(feature.key, checked)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Furnishing */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Building className="h-4 w-4" />
            Furnishing
          </Label>
          <Select
            value={filters.furnishingType || "any"}
            onValueChange={(value) => updateFilter("furnishingType", value !== "any" ? value : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {FURNISHING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Construction */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            Construction
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={filters.constructionStatus || "any"}
              onValueChange={(value) => updateFilter("constructionStatus", value !== "any" ? value : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Status</SelectItem>
                {CONSTRUCTION_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.minYearBuilt?.toString() || "any"}
              onValueChange={(value) => updateFilter("minYearBuilt", value !== "any" ? Number.parseInt(value) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Year</SelectItem>
                {[...Array(20)].map((_, i) => {
                  const year = new Date().getFullYear() - i
                  return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Other */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <Wrench className="h-4 w-4" />
            Other
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={filters.facingDirection || "any"}
              onValueChange={(value) => updateFilter("facingDirection", value !== "any" ? value : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Facing Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {FACING_DIRECTIONS.map((direction) => (
                  <SelectItem key={direction.value} value={direction.value}>
                    {direction.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.propertyCondition || "any"}
              onValueChange={(value) => updateFilter("propertyCondition", value !== "any" ? value : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {PROPERTY_CONDITIONS.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Sorting */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4" />
            Sort By
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAP_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => updateFilter("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Filters
        </Button>
      </div>
    </ScrollArea>
  );
}
