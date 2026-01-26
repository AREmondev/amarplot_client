"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Maximize, Car, Bus, Train, AlertTriangle, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LocationMapProps {
  coordinates: {
    latitude: number
    longitude: number
  }
  address: string
}

// Google Maps configuration (reusing from google-maps-integration.tsx)
const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  defaultZoom: 15,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
}

// Declare global google maps types
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function LocationMap({ coordinates, address }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Google Maps API
  useEffect(() => {
    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      setError("Google Maps API key is not configured")
      return
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true

      window.initMap = () => {
        setIsLoaded(true)
      }

      script.onerror = () => setError("Failed to load Google Maps")
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
        delete window.initMap
      }
    }

    const cleanup = loadGoogleMaps()
    return cleanup
  }, [])

  // Initialize map and add marker
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !window.google) return

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: coordinates.latitude, lng: coordinates.longitude },
        zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
        styles: GOOGLE_MAPS_CONFIG.styles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      })

      new window.google.maps.Marker({
        position: { lat: coordinates.latitude, lng: coordinates.longitude },
        map: newMap,
        title: address,
      })

      setMap(newMap)
    } catch (err) {
      setError("Failed to initialize Google Maps")
      console.error("Google Maps initialization error:", err)
    }
  }, [isLoaded, map, coordinates, address])

  const nearbyPlaces = [
    { name: "Gulshan Shopping Center", distance: "0.5 km", type: "shopping" },
    { name: "Gulshan Lake Park", distance: "0.8 km", type: "park" },
    { name: "American International School", distance: "1.2 km", type: "school" },
    { name: "United Hospital", distance: "1.5 km", type: "hospital" },
  ]

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Map Not Available</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              To enable Google Maps integration:
              <br />
              1. Get a Google Maps API key from Google Cloud Console
              <br />
              2. Add it to your environment variables as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              <br />
              3. Enable Maps JavaScript API in Google Cloud Console
              <br />
              4. Add your domain to the API key restrictions
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Map...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <div ref={mapRef} className="h-full w-full" />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                <Navigation className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-3">Nearby Places</h4>
          <div className="space-y-2">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{place.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{place.type}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {place.distance}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Transportation</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Bus className="h-4 w-4 text-primary" />
                <span className="text-sm">Bus Stop</span>
              </div>
              <Badge variant="outline" className="text-xs">
                200m
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4 text-primary" />
                <span className="text-sm">Metro Station</span>
              </div>
              <Badge variant="outline" className="text-xs">
                1.2km
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                <span className="text-sm">Parking</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Available
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}