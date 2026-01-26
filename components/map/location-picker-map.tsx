"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Settings, AlertTriangle } from "lucide-react";

interface LocationPickerMapProps {
  initialCoordinates: { latitude: number; longitude: number };
  onCoordinatesChange: (coords: {
    latitude: number;
    longitude: number;
  }) => void;
}

const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  defaultZoom: 12,
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
};

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function LocationPickerMap({
  initialCoordinates,
  onCoordinatesChange,
}: LocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLat, setInitialLat] = useState<number>(
    initialCoordinates.latitude
  );
  const [initialLng, setInitialLng] = useState<number>(
    initialCoordinates.longitude
  );
  useEffect(() => {
    console.log("GOOGLE_MAPS_CONFIG", GOOGLE_MAPS_CONFIG);
    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      setError("Google Maps API key is not configured");
      return;
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      // Check if script is already in the DOM
      if (
        document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)
      ) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setIsLoaded(true);
      };

      script.onerror = () => setError("Failed to load Google Maps");
      document.head.appendChild(script);

      return () => {
        // No need to remove script or delete initMap, as it's a global singleton
      };
    };

    const cleanup = loadGoogleMaps();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !window.google) return;

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: initialCoordinates.latitude,
          lng: initialCoordinates.longitude,
        },
        zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
        styles: GOOGLE_MAPS_CONFIG.styles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      const newMarker = new window.google.maps.Marker({
        position: {
          lat: initialCoordinates.latitude,
          lng: initialCoordinates.longitude,
        },
        map: newMap,
        draggable: true,
      });

      newMarker.addListener("dragend", () => {
        const newPosition = newMarker.getPosition();
        if (newPosition) {
          onCoordinatesChange({
            latitude: newPosition.lat(),
            longitude: newPosition.lng(),
          });
        }
      });

      setMap(newMap);
      setMarker(newMarker);
    } catch (err) {
      setError("Failed to initialize Google Maps");
      console.error("Google Maps initialization error:", err);
    }
  }, [isLoaded, map, onCoordinatesChange]);

  useEffect(() => {
    if (map && marker) {
      map.setCenter({
        lat: initialCoordinates.latitude,
        lng: initialCoordinates.longitude,
      });
      marker.setPosition({
        lat: initialCoordinates.latitude,
        lng: initialCoordinates.longitude,
      });
    }
  }, [initialCoordinates, map, marker]);

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
              2. Add it to your environment variables as
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              <br />
              3. Enable Maps JavaScript API in Google Cloud Console
              <br />
              4. Add your domain to the API key restrictions
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Map...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
