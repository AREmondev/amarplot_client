"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Navigation,
  Square,
  Circle,
  OctagonIcon as Polygon,
  Trash2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Filter,
  Search,
  Navigation2,
  Target,
} from "lucide-react"
import { PROPERTY_TYPES } from "@/lib/constants"

interface EnhancedMapSearchProps {
  onPropertySelect: (propertyId: string) => void
}

// Mock property data with more realistic positioning
const propertyMarkers = [
  {
    id: "1",
    lat: 23.7808,
    lng: 90.4142,
    price: 850000,
    type: "flat",
    title: "3BHK Luxury Apartment",
    beds: 3,
    baths: 2,
    area: 1200,
    urgent: false,
    verified: true,
  },
  {
    id: "2",
    lat: 23.8759,
    lng: 90.3795,
    price: 1200000,
    type: "plot",
    title: "Commercial Plot",
    area: 2500,
    urgent: true,
    verified: true,
  },
  {
    id: "3",
    lat: 23.7286,
    lng: 90.3854,
    price: 8000,
    type: "mess",
    title: "Student Mess",
    area: 150,
    urgent: false,
    verified: false,
  },
  {
    id: "4",
    lat: 23.7516,
    lng: 90.3876,
    price: 650000,
    type: "flat",
    title: "2BHK Apartment",
    beds: 2,
    baths: 1,
    area: 900,
    urgent: false,
    verified: true,
  },
  {
    id: "5",
    lat: 23.8103,
    lng: 90.4125,
    price: 950000,
    type: "plot",
    title: "Residential Plot",
    area: 1800,
    urgent: false,
    verified: true,
  },
  {
    id: "6",
    lat: 23.7608,
    lng: 90.3912,
    price: 750000,
    type: "flat",
    title: "2BHK Modern Flat",
    beds: 2,
    baths: 2,
    area: 1100,
    urgent: true,
    verified: true,
  },
]

// Heat zones for price visualization
const heatZones = [
  { center: [23.7808, 90.4142], radius: 0.02, intensity: 0.8, label: "High Price Zone" },
  { center: [23.8759, 90.3795], radius: 0.015, intensity: 0.6, label: "Medium Price Zone" },
  { center: [23.7286, 90.3854], radius: 0.01, intensity: 0.3, label: "Budget Zone" },
]

export function EnhancedMapSearch({ onPropertySelect }: EnhancedMapSearchProps) {
  const [drawingMode, setDrawingMode] = useState<"none" | "rectangle" | "circle" | "polygon">("none")
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([])
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [mapLayer, setMapLayer] = useState<"normal" | "satellite" | "heatmap">("normal")
  const [priceFilter, setPriceFilter] = useState([0, 2000000])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMarkers, setFilteredMarkers] = useState(propertyMarkers)
  const [zoomLevel, setZoomLevel] = useState(12)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Filter markers based on price and search
  useEffect(() => {
    let filtered = propertyMarkers.filter((marker) => marker.price >= priceFilter[0] && marker.price <= priceFilter[1])

    if (searchQuery) {
      filtered = filtered.filter(
        (marker) =>
          marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          marker.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredMarkers(filtered)
  }, [priceFilter, searchQuery])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.log("Location access denied"),
      )
    }
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    }
    return `₹${price.toLocaleString()}`
  }

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "flat":
        return "bg-blue-500"
      case "plot":
        return "bg-green-500"
      case "land":
        return "bg-yellow-500"
      case "mess":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMarkerSize = (price: number) => {
    if (price > 1000000) return "w-12 h-12"
    if (price > 500000) return "w-10 h-10"
    return "w-8 h-8"
  }

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarkers((prev) => (prev.includes(markerId) ? prev.filter((id) => id !== markerId) : [...prev, markerId]))
    onPropertySelect(markerId)
  }

  const clearDrawings = () => {
    setDrawingMode("none")
    setSelectedMarkers([])
  }

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 18))
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 8))

  return (
    <div className="h-full relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Map Background with Dynamic Layers */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          mapLayer === "satellite"
            ? "bg-gradient-to-br from-gray-800 to-gray-600"
            : mapLayer === "heatmap"
              ? "bg-gradient-to-br from-red-100 to-orange-100"
              : "bg-gradient-to-br from-blue-50 to-green-50"
        }`}
      >
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${50 * (zoomLevel / 12)}px ${50 * (zoomLevel / 12)}px`,
          }}
        />

        {/* Heat Map Zones */}
        {mapLayer === "heatmap" &&
          heatZones.map((zone, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-gradient-radial from-red-400/40 to-transparent animate-pulse"
              style={{
                left: `${(zone.center[1] - 90.35) * 2000 + 40}%`,
                top: `${(23.85 - zone.center[0]) * 2000 + 30}%`,
                width: `${zone.radius * 5000}px`,
                height: `${zone.radius * 5000}px`,
                transform: "translate(-50%, -50%)",
                opacity: zone.intensity,
              }}
            />
          ))}

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              left: `${(userLocation.lng - 90.35) * 2000 + 50}%`,
              top: `${(23.85 - userLocation.lat) * 2000 + 40}%`,
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-ping absolute" />
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
            </div>
          </div>
        )}

        {/* Property Markers */}
        {filteredMarkers.map((marker, index) => (
          <div
            key={marker.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-all duration-300 ${
              hoveredMarker === marker.id ? "scale-125" : "hover:scale-110"
            } ${selectedMarkers.includes(marker.id) ? "z-30" : ""}`}
            style={{
              left: `${(marker.lng - 90.35) * 2000 + 20 + index * 5}%`,
              top: `${(23.85 - marker.lat) * 2000 + 30 + index * 3}%`,
            }}
            onClick={() => handleMarkerClick(marker.id)}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            {/* Marker Pin */}
            <div
              className={`${getMarkerSize(marker.price)} rounded-full ${getMarkerColor(marker.type)} 
              flex items-center justify-center text-white shadow-lg border-2 
              ${selectedMarkers.includes(marker.id) ? "border-yellow-400 ring-4 ring-yellow-400/30" : "border-white"}
              ${marker.urgent ? "animate-bounce" : ""}
            `}
            >
              {marker.verified && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
              )}
              <MapPin className="h-4 w-4" />
            </div>

            {/* Price Badge - Always Visible on Hover */}
            <div
              className={`absolute -top-12 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                hoveredMarker === marker.id || selectedMarkers.includes(marker.id)
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-75"
              }`}
            >
              <div className="bg-white shadow-lg rounded-lg px-3 py-2 border">
                <div className="text-sm font-bold text-primary">{formatPrice(marker.price)}</div>
                <div className="text-xs text-muted-foreground">{marker.title}</div>
                {marker.beds && (
                  <div className="text-xs text-muted-foreground">
                    {marker.beds}BR • {marker.area} sq ft
                  </div>
                )}
              </div>
            </div>

            {/* Selection Ring */}
            {selectedMarkers.includes(marker.id) && (
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse -m-2" />
            )}
          </div>
        ))}
      </div>

      {/* Top Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 w-96">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search area, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left Sidebar - Filters */}
      <div className="absolute left-4 top-20 z-40 w-72">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Price Range
              </h3>
              <Slider
                value={priceFilter}
                onValueChange={setPriceFilter}
                max={2000000}
                min={0}
                step={50000}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatPrice(priceFilter[0])}</span>
                <span>{formatPrice(priceFilter[1])}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Property Types</h3>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => {
                  const count = filteredMarkers.filter((m) => m.type === type.value).length
                  return (
                    <Badge
                      key={type.value}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {type.label} ({count})
                    </Badge>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Map Layers</h3>
              <div className="flex gap-2">
                {[
                  { key: "normal", label: "Normal" },
                  { key: "satellite", label: "Satellite" },
                  { key: "heatmap", label: "Heat Map" },
                ].map((layer) => (
                  <Button
                    key={layer.key}
                    variant={mapLayer === layer.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapLayer(layer.key as any)}
                  >
                    {layer.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawing Tools */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Button
                variant={drawingMode === "rectangle" ? "default" : "outline"}
                size="sm"
                onClick={() => setDrawingMode(drawingMode === "rectangle" ? "none" : "rectangle")}
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={drawingMode === "circle" ? "default" : "outline"}
                size="sm"
                onClick={() => setDrawingMode(drawingMode === "circle" ? "none" : "circle")}
              >
                <Circle className="h-4 w-4" />
              </Button>
              <Button
                variant={drawingMode === "polygon" ? "default" : "outline"}
                size="sm"
                onClick={() => setDrawingMode(drawingMode === "polygon" ? "none" : "polygon")}
              >
                <Polygon className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="outline" size="sm" onClick={clearDrawings}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">{selectedMarkers.length} selected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Controls */}
      <div className="absolute right-4 top-20 z-40 flex flex-col gap-2">
        {/* Zoom Controls */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="text-xs text-center py-1">{zoomLevel}</div>
              <Button variant="ghost" size="icon" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Target className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Navigation2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawing Instructions */}
      {drawingMode !== "none" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {drawingMode === "rectangle" && "Click and drag to draw a rectangle area"}
                {drawingMode === "circle" && "Click and drag to draw a circular area"}
                {drawingMode === "polygon" && "Click to add points, double-click to finish polygon"}
              </p>
              <Button size="sm" onClick={() => setDrawingMode("none")}>
                Cancel Drawing
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Summary */}
      <div className="absolute bottom-4 right-4 z-40">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-3">
            <div className="text-sm">
              <div className="font-semibold">{filteredMarkers.length} Properties</div>
              <div className="text-muted-foreground">
                {selectedMarkers.length > 0 && `${selectedMarkers.length} selected • `}
                Zoom: {zoomLevel}x
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
