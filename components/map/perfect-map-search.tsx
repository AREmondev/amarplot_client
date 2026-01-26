"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ZoomIn,
  ZoomOut,
  Target,
  Navigation2,
  Crosshair,
  Home,
  Building2,
  MapPin,
  Landmark,
  Users,
  Key,
  Verified,
  Clock,
  Phone,
  Heart,
  Eye,
} from "lucide-react"

interface PerfectMapSearchProps {
  onPropertySelect: (propertyId: string) => void
  searchQuery: string
  filters: any
  compact?: boolean
}

// Enhanced property data with categories and more details
const propertyMarkers = [
  {
    id: "1",
    lat: 23.7808,
    lng: 90.4142,
    price: 850000,
    type: "flat",
    category: "sell",
    title: "3BHK Luxury Apartment",
    beds: 3,
    baths: 2,
    area: 1200,
    urgent: false,
    verified: true,
    address: "Gulshan Avenue, Road 11",
    owner: "Ahmed Khan",
    posted: "2 days ago",
    description: "Modern apartment with premium amenities",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "2",
    lat: 23.8759,
    lng: 90.3795,
    price: 1200000,
    type: "plot",
    category: "sell",
    title: "Commercial Plot",
    area: 2500,
    urgent: true,
    verified: true,
    address: "Sector 7, Uttara",
    owner: "Fatima Rahman",
    posted: "1 day ago",
    description: "Prime location for business development",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "3",
    lat: 23.7286,
    lng: 90.3854,
    price: 8000,
    type: "mess",
    category: "rent",
    title: "Student Mess Near DU",
    area: 150,
    urgent: false,
    verified: false,
    address: "Nilkhet, Near DU",
    owner: "Karim Uddin",
    posted: "5 days ago",
    description: "Affordable mess facility for students",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "4",
    lat: 23.7516,
    lng: 90.3876,
    price: 25000,
    type: "flat",
    category: "rent",
    title: "2BHK Modern Apartment",
    beds: 2,
    baths: 1,
    area: 900,
    urgent: false,
    verified: true,
    address: "Dhanmondi, Road 27",
    owner: "Nasir Ahmed",
    posted: "3 days ago",
    description: "Well-maintained apartment for rent",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "5",
    lat: 23.8103,
    lng: 90.4125,
    price: 950000,
    type: "plot",
    category: "sell",
    title: "Residential Plot",
    area: 1800,
    urgent: false,
    verified: true,
    address: "Bashundhara R/A",
    owner: "Salma Begum",
    posted: "1 week ago",
    description: "Ready to build residential plot",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "6",
    lat: 23.795,
    lng: 90.405,
    price: 1500000,
    type: "land",
    category: "sell",
    title: "Agricultural Land",
    area: 5000,
    urgent: false,
    verified: true,
    address: "Tejgaon Industrial Area",
    owner: "Habib Mia",
    posted: "2 weeks ago",
    description: "Large agricultural land for farming",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "7",
    lat: 23.74,
    lng: 90.37,
    price: 35000,
    type: "flat",
    category: "rent",
    title: "Executive Apartment",
    beds: 3,
    baths: 2,
    area: 1400,
    urgent: false,
    verified: true,
    address: "New Market Area",
    owner: "Rashida Khatun",
    posted: "6 days ago",
    description: "Fully furnished executive apartment",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "8",
    lat: 23.82,
    lng: 90.36,
    price: 2200000,
    type: "flat",
    category: "sell",
    title: "4BHK Penthouse",
    beds: 4,
    baths: 3,
    area: 2000,
    urgent: false,
    verified: true,
    address: "Mirpur DOHS",
    owner: "Dr. Mahmud",
    posted: "1 day ago",
    description: "Luxury penthouse with rooftop garden",
    images: ["/placeholder.svg?height=200&width=300"],
  },
]

export function PerfectMapSearch({ onPropertySelect, searchQuery, filters, compact = false }: PerfectMapSearchProps) {
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([])
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [filteredMarkers, setFilteredMarkers] = useState(propertyMarkers)
  const [zoomLevel, setZoomLevel] = useState(12)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 23.7808, lng: 90.4142 })
  const [showGoogleMapsNotice, setShowGoogleMapsNotice] = useState(true)

  // Get current location with high accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        () => {
          // Fallback to Dhaka center
          setUserLocation({ lat: 23.7808, lng: 90.4142 })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    }
  }, [])

  // Filter markers based on search and filters
  useEffect(() => {
    let filtered = [...propertyMarkers]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (marker) =>
          marker.title.toLowerCase().includes(query) ||
          marker.address.toLowerCase().includes(query) ||
          marker.type.toLowerCase().includes(query) ||
          marker.category.toLowerCase().includes(query) ||
          marker.owner.toLowerCase().includes(query),
      )
    }

    // Apply filters
    filtered = filtered.filter((marker) => {
      // Price filter
      if (marker.price < filters.priceRange[0] || marker.price > filters.priceRange[1]) return false

      // Type filter
      if (!filters.propertyTypes[marker.type]) return false

      // Verification filter
      if (filters.verified && !marker.verified) return false

      // Urgent filter
      if (filters.urgent && !marker.urgent) return false

      // Bedroom filter
      if (filters.bedrooms && (marker.beds || 0) < filters.bedrooms) return false

      // Bathroom filter
      if (filters.bathrooms && (marker.baths || 0) < filters.bathrooms) return false

      return true
    })

    setFilteredMarkers(filtered)
  }, [searchQuery, filters])

  const formatPrice = (price: number, category: string) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L${category === "rent" ? "/mo" : ""}`
    }
    return `₹${price.toLocaleString()}${category === "rent" ? "/mo" : ""}`
  }

  // Get property icon based on type and category
  const getPropertyIcon = (type: string, category: string) => {
    if (category === "rent") {
      switch (type) {
        case "flat":
          return Key
        case "mess":
          return Users
        default:
          return Key
      }
    } else {
      switch (type) {
        case "flat":
          return Building2
        case "plot":
          return Home
        case "land":
          return Landmark
        case "mess":
          return Users
        default:
          return MapPin
      }
    }
  }

  // Get marker color based on type and category
  const getMarkerColor = (type: string, category: string) => {
    if (category === "rent") {
      return "bg-orange-500 border-orange-600 shadow-orange-200"
    }

    switch (type) {
      case "flat":
        return "bg-blue-500 border-blue-600 shadow-blue-200"
      case "plot":
        return "bg-green-500 border-green-600 shadow-green-200"
      case "land":
        return "bg-yellow-500 border-yellow-600 shadow-yellow-200"
      case "mess":
        return "bg-purple-500 border-purple-600 shadow-purple-200"
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-200"
    }
  }

  // Get marker size based on price and importance
  const getMarkerSize = (price: number, isSelected: boolean, isHovered: boolean) => {
    let baseSize = "w-10 h-10"
    if (price > 1500000) baseSize = "w-14 h-14"
    else if (price > 800000) baseSize = "w-12 h-12"

    if (isSelected || isHovered) {
      return baseSize.replace("w-", "w-1").replace("h-", "h-1")
    }
    return baseSize
  }

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkers((prev) => (prev.includes(markerId) ? prev.filter((id) => id !== markerId) : [...prev, markerId]))
    onPropertySelect(markerId)
  }

  const centerOnUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation)
      setZoomLevel(15)
    }
  }

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 20))
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 8))

  return (
    <TooltipProvider>
      <div className="h-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Google Maps Integration Notice */}
        {showGoogleMapsNotice && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Demo Mode - Add Google Maps API key for real map integration</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGoogleMapsNotice(false)}
                    className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
          {/* Realistic Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px),
                linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)
              `,
              backgroundSize: `${Math.max(20, 50 * (zoomLevel / 12))}px ${Math.max(20, 50 * (zoomLevel / 12))}px, ${Math.max(10, 25 * (zoomLevel / 12))}px ${Math.max(10, 25 * (zoomLevel / 12))}px`,
            }}
          />

          {/* Roads/Streets Simulation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 transform rotate-12"></div>
            <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 transform -rotate-6"></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-400 transform rotate-3"></div>
            <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-400 transform -rotate-2"></div>
          </div>

          {/* Search Radius Circle with Animation */}
          {userLocation && filters.showSearchRadius && (
            <div
              className="absolute border-2 border-blue-400 border-dashed rounded-full pointer-events-none"
              style={{
                left: `${(userLocation.lng - 90.35) * 2000 + 50}%`,
                top: `${(23.85 - userLocation.lat) * 2000 + 40}%`,
                width: `${filters.searchRadius * 20}px`,
                height: `${filters.searchRadius * 20}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-blue-400/20 via-blue-400/10 to-transparent animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-blue-300 border-dotted" />
            </div>
          )}

          {/* Enhanced User Location */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
              style={{
                left: `${(userLocation.lng - 90.35) * 2000 + 50}%`,
                top: `${(23.85 - userLocation.lat) * 2000 + 40}%`,
              }}
            >
              <div className="relative">
                {/* Accuracy Circle */}
                <div className="absolute w-8 h-8 bg-blue-200/40 rounded-full border border-blue-300/60 -inset-2 animate-ping" />

                {/* User Marker */}
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10">
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                  </div>

                  {/* Direction Indicator */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Navigation2 className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Property Markers */}
          {filteredMarkers.map((marker, index) => {
            const isSelected = selectedMarkers.includes(marker.id)
            const isHovered = hoveredMarker === marker.id
            const IconComponent = getPropertyIcon(marker.type, marker.category)

            return (
              <Tooltip key={marker.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 
                      transition-all duration-300 ${isHovered ? "scale-125 z-40" : "hover:scale-110"} 
                      ${isSelected ? "z-30" : ""}`}
                    style={{
                      left: `${(marker.lng - 90.35) * 2000 + 20 + (index % 3) * 3}%`,
                      top: `${(23.85 - marker.lat) * 2000 + 30 + (index % 3) * 3}%`,
                    }}
                    onClick={() => handleMarkerClick(marker.id)}
                    onMouseEnter={() => setHoveredMarker(marker.id)}
                    onMouseLeave={() => setHoveredMarker(null)}
                  >
                    {/* Selection Ring */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse -m-4" />
                    )}

                    {/* Marker Shadow */}
                    <div
                      className={`absolute inset-0 rounded-full ${getMarkerColor(marker.type, marker.category).split(" ")[2]} opacity-30 blur-sm scale-110`}
                    />

                    {/* Main Marker */}
                    <div
                      className={`${getMarkerSize(marker.price, isSelected, isHovered)} rounded-full ${getMarkerColor(marker.type, marker.category)} 
                      flex items-center justify-center text-white shadow-lg border-2 border-white
                      ${marker.urgent ? "animate-bounce" : ""}
                      ${isSelected ? "ring-4 ring-yellow-400/50" : ""}
                      relative overflow-hidden transition-all duration-300`}
                    >
                      {/* Verification Badge */}
                      {marker.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10 flex items-center justify-center">
                          <Verified className="h-2 w-2 text-white" />
                        </div>
                      )}

                      {/* Urgent Indicator */}
                      {marker.urgent && <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse" />}

                      {/* Category Badge */}
                      {marker.category === "rent" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-600 rounded-full border-2 border-white z-10 flex items-center justify-center">
                          <Key className="h-2 w-2 text-white" />
                        </div>
                      )}

                      <IconComponent className="h-5 w-5 relative z-10" />
                    </div>

                    {/* Enhanced Info Card */}
                    <div
                      className={`absolute -top-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                        isHovered || isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white shadow-xl rounded-lg p-3 border min-w-56 max-w-72">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-bold text-primary">
                                {formatPrice(marker.price, marker.category)}
                              </div>
                              <Badge variant={marker.category === "rent" ? "secondary" : "outline"} className="text-xs">
                                {marker.category}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium line-clamp-1 mb-1">{marker.title}</div>
                          </div>

                          {marker.urgent && (
                            <Badge variant="destructive" className="text-xs ml-2">
                              <Clock className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground mb-2 line-clamp-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {marker.address}
                        </div>

                        {marker.beds && (
                          <div className="text-xs text-muted-foreground mb-3">
                            {marker.beds}BR • {marker.baths}BA • {marker.area} sq ft
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">By {marker.owner}</span>
                            {marker.verified && <Verified className="h-3 w-3 text-green-500" />}
                          </div>
                          <span className="text-muted-foreground">{marker.posted}</span>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1 mt-2 pt-2 border-t">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="text-center">
                    <div className="font-medium">{marker.title}</div>
                    <div className="text-sm text-muted-foreground">{formatPrice(marker.price, marker.category)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {marker.type} • {marker.category}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* Enhanced Map Controls */}
        {!compact && (
          <div className="absolute right-4 top-20 z-40 flex flex-col gap-3">
            {/* Zoom Controls */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoomLevel >= 20}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Zoom In</TooltipContent>
                  </Tooltip>

                  <div className="text-xs text-center py-1 font-mono bg-muted rounded px-2">{zoomLevel}x</div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoomLevel <= 8}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Zoom Out</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={centerOnUserLocation}>
                        <Target className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Center on Location</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Navigation2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Navigation</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Crosshair className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Crosshair</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compact Controls */}
        {compact && (
          <div className="absolute top-4 right-4 z-40 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/90 hover:bg-white shadow-lg"
                  onClick={centerOnUserLocation}
                >
                  <Target className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Center on Location</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Enhanced Results Counter */}
        <div className="absolute bottom-4 left-4 z-40">
          <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-lg">{filteredMarkers.length}</div>
                  <span className="text-muted-foreground">Properties Found</span>
                </div>

                {selectedMarkers.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">{selectedMarkers.length} selected</Badge>
                  </div>
                )}

                {/* Property Type Distribution */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" />
                    <span>{filteredMarkers.filter((m) => m.type === "flat").length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="h-3 w-3 text-green-500" />
                    <span>{filteredMarkers.filter((m) => m.type === "plot").length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Landmark className="h-3 w-3 text-yellow-500" />
                    <span>{filteredMarkers.filter((m) => m.type === "land").length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-purple-500" />
                    <span>{filteredMarkers.filter((m) => m.type === "mess").length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-40">
          <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-center mb-2">Property Types</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Building2 className="h-2 w-2 text-white" />
                    </div>
                    <span>Flats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Home className="h-2 w-2 text-white" />
                    </div>
                    <span>Plots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Landmark className="h-2 w-2 text-white" />
                    </div>
                    <span>Land</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                    <span>Mess</span>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <Key className="h-2 w-2 text-white" />
                    </div>
                    <span>For Rent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
