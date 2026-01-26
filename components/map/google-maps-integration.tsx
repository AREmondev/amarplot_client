"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Settings, AlertTriangle } from "lucide-react";

import { Property } from "@/lib/api/property";

interface GoogleMapsIntegrationProps {
  onPropertySelect: (propertyId: string) => void;
  properties: Property[];
}

export interface GoogleMapsRef {
  centerOnUserLocation: () => void;
}

// Google Maps configuration
const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  defaultCenter: { lat: 23.685, lng: 90.3563 }, // Bangladesh center
  defaultZoom: 7, // Show full Bangladesh when no specific location
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

// Declare global google maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const GoogleMapsIntegration = forwardRef<
  GoogleMapsRef,
  GoogleMapsIntegrationProps
>(({ onPropertySelect, properties }, ref) => {
  console.log("Google Location", properties);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const infoWindowRef = useRef<any>(null); // Ref for the single InfoWindow instance

  // Function to center map on user's current location
  const centerOnUserLocation = () => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(userLocation);
        map.setZoom(15);

        // Add a marker for user's location
        new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/></svg>'
            )}`,
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12),
          },
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert(
          "Unable to get your location. Please check your browser settings."
        );
      }
    );
  };

  // Expose the function to parent component
  useImperativeHandle(ref, () => ({
    centerOnUserLocation,
  }));

  // Load Google Maps API
  useEffect(() => {
    if (!GOOGLE_MAPS_CONFIG.apiKey) {
      setError("Google Maps API key is not configured");
      return;
    }

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      console.log("script", script);

      // Set up callback
      window.initMap = () => {
        setIsLoaded(true);
      };

      script.onerror = () => setError("Failed to load Google Maps");
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        // Safely remove initMap from window
        (window as any).initMap = undefined;
      };
    };

    const cleanup = loadGoogleMaps();
    return cleanup;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !window.google) return;

    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: GOOGLE_MAPS_CONFIG.defaultCenter,
        zoom: GOOGLE_MAPS_CONFIG.defaultZoom,
        styles: GOOGLE_MAPS_CONFIG.styles,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
      });

      setMap(newMap);
      infoWindowRef.current = new window.google.maps.InfoWindow(); // Initialize InfoWindow once
    } catch (err) {
      setError("Failed to initialize Google Maps");
      console.error("Google Maps initialization error:", err);
    }
  }, [isLoaded, map]);

  // Create property markers
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    // If no properties, just clear markers and return
    if (!properties.length) {
      setMarkers([]);
      return;
    }

    const newMarkers = properties
      .map((property) => {
        // Create custom marker icon based on property type
        const icon = {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            createMarkerSVG(property)
          )}`,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40),
        };

        // Extract coordinates properly - handle both formats
        let lat: number, lng: number;

        if (
          "coordinates" in property.location.coordinates &&
          Array.isArray(property.location.coordinates.coordinates)
        ) {
          // New format: GeoJSON coordinates array [longitude, latitude]
          lng = property.location.coordinates.coordinates[0];
          lat = property.location.coordinates.coordinates[1];
        } else if (
          "latitude" in property.location.coordinates &&
          "longitude" in property.location.coordinates
        ) {
          // Old format: separate latitude/longitude properties
          lat = parseFloat(property.location.coordinates.latitude);
          lng = parseFloat(property.location.coordinates.longitude);
        } else {
          console.warn("Invalid coordinates for property:", property._id);
          return null; // Skip this property if coordinates are invalid
        }

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: property.title,
          icon: icon,
          animation: property.isUrgentSale
            ? window.google.maps.Animation.BOUNCE
            : undefined,
        });

        // Create hover info window for this marker
        const hoverInfoWindow = new window.google.maps.InfoWindow({
          content: createHoverContent(property),
          disableAutoPan: true,
          pixelOffset: new window.google.maps.Size(0, -10),
        });

        // Add hover listeners
        marker.addListener("mouseover", () => {
          hoverInfoWindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
          hoverInfoWindow.close();
        });

        // Add click listener for detailed view
        marker.addListener("click", () => {
          // alert("Clicl Marker");
          if (infoWindowRef.current) {
            // Check for multiple properties at same location
            const sameLocationProperties = properties.filter((p) => {
              let pLat, pLng;
              if (
                Array.isArray(p.location.coordinates) &&
                p.location.coordinates.length === 2
              ) {
                // GeoJSON format: [longitude, latitude]
                pLng = p.location.coordinates[0];
                pLat = p.location.coordinates[1];
              } else if (
                "coordinates" in p.location.coordinates &&
                Array.isArray(p.location.coordinates.coordinates)
              ) {
                // Nested GeoJSON format
                pLng = p.location.coordinates.coordinates[0];
                pLat = p.location.coordinates.coordinates[1];
              } else if (
                "latitude" in p.location.coordinates &&
                "longitude" in p.location.coordinates
              ) {
                // Old format: separate latitude/longitude properties
                pLat = parseFloat(p.location.coordinates.latitude);
                pLng = parseFloat(p.location.coordinates.longitude);
              } else {
                return false; // Skip invalid coordinates
              }
              return (
                Math.abs(pLat - lat) < 0.0001 && Math.abs(pLng - lng) < 0.0001
              );
            });

            if (sameLocationProperties.length > 1) {
              infoWindowRef.current.setContent(
                createMultiPropertyContent(sameLocationProperties)
              );
            } else {
              infoWindowRef.current.setContent(
                createInfoWindowContent(property)
              );
            }
            infoWindowRef.current.open(map, marker);
            // onPropertySelect(property._id);
          }
        });

        return marker;
      })
      .filter((marker) => marker !== null); // Filter out null markers

    setMarkers(newMarkers);

    // Fit map to show all markers with zoom limit
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);

      // Prevent excessive zoom by setting a maximum zoom level
      const listener = window.google.maps.event.addListenerOnce(
        map,
        "bounds_changed",
        () => {
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
        }
      );
    }
  }, [map, properties]); // Removed onPropertySelect from dependencies to prevent unnecessary re-renders

  // Create SVG marker based on property type and category
  const createMarkerSVG = (property: any) => {
    const getColor = (type: string, category: string) => {
      if (category === "rent") return "#f97316"; // orange
      switch (type?.toLowerCase()) {
        case "flat":
          return "#3b82f6"; // blue
        case "plot":
          return "#22c55e"; // green
        case "land":
          return "#eab308"; // yellow
        case "mess":
          return "#a855f7"; // purple
        default:
          return "#6b7280"; // gray
      }
    };

    const getIcon = (type: string, category: string) => {
      if (category === "rent") return "🔑";
      switch (type?.toLowerCase()) {
        case "flat":
          return "🏢";
        case "plot":
          return "🏠";
        case "land":
          return "🌾";
        case "mess":
          return "👥";
        default:
          return "📍";
      }
    };

    const color = getColor(property.property_type, property.transaction_type);
    const icon = getIcon(property.property_type, property.transaction_type);

    return `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" strokeWidth="2"/>
        ${
          property.isVerified
            ? '<circle cx="30" cy="10" r="6" fill="#22c55e" stroke="white" strokeWidth="1"/>'
            : ""
        }
        ${
          property.isUrgentSale
            ? '<circle cx="10" cy="10" r="6" fill="#ef4444" stroke="white" strokeWidth="1"/>'
            : ""
        }
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
          ${icon}
        </text>
      </svg>
    `;
  };

  // Helper function to format price
  const formatPrice = (price: number, category: string) => {
    if (price >= 100000) {
      const suffix = category === "rent" ? "/mo" : "";
      return `₹${(price / 100000).toFixed(1)}L${suffix}`;
    }
    const suffix = category === "rent" ? "/mo" : "";
    return `₹${price.toLocaleString()}${suffix}`;
  };

  // Create minimal hover content
  const createHoverContent = (property: any) => {
    return `<div><strong>${property.title}</strong><br>${formatPrice(
      property.price,
      property.transaction_type
    )}</div>`;
  };

  // Create multi-property content for same location
  const createMultiPropertyContent = (properties: any[]) => {
    const propertyCards = properties
      .map(
        (property) => `
      <div style="
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        background: #fafafa;
        cursor: pointer;
        transition: background 0.2s;
      " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='#fafafa'">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
          <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${
            property.title
          }</h4>
          <span style="
            background: ${
              property.transaction_type === "rent" ? "#fef3c7" : "#dbeafe"
            };
            color: ${
              property.transaction_type === "rent" ? "#d97706" : "#2563eb"
            };
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 500;
          ">${property.transaction_type}</span>
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #2563eb; margin-bottom: 4px;">
          ${formatPrice(property.price, property.transaction_type)}
        </div>
        ${
          property.bedrooms
            ? `
          <div style="font-size: 11px; color: #6b7280;">
            ${property.bedrooms}BR • ${property.bathrooms}BA • ${property.size} sq ft
          </div>
        `
            : ""
        }
      </div>
    `
      )
      .join("");

    return `
      <div style="max-width: 320px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
          ">${properties.length}</div>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">
            Properties at this location
          </h3>
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
          ${propertyCards}
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <button onclick="alert('View all properties feature would be implemented here')" style="
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
          ">View All Properties</button>
        </div>
      </div>
    `;
  };

  // Create detailed info window content for click (big modal style)
  const createInfoWindowContent = (property: any) => {
    const bedroomInfo = property.bedrooms
      ? `<p style="margin: 8px 0; font-size: 14px; color: #666;">${property.bedrooms}BR • ${property.bathrooms}BA • ${property.size} sq ft</p>`
      : "";

    return `
      <div style="max-width: 350px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #111;">${
          property.title
        }</h3>
        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px;">${
          property.location.address
        }</p>
        <div style="margin-bottom: 12px;">
          <span style="font-size: 20px; font-weight: 700; color: #2563eb;">${formatPrice(
            property.price,
            property.transaction_type
          )}</span>
          <span style="margin-left: 8px; background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">${
            property.transaction_type
          }</span>
        </div>
        ${bedroomInfo}
        <p style="margin: 12px 0; font-size: 14px; color: #555; line-height: 1.4;">${
          property.description
        }</p>
        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button onclick="alert('Call feature would be implemented here')" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">Call</button>
          <button onclick="alert('View details feature would be implemented here')" style="background: #f3f4f6; color: #374151; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">View Details</button>
        </div>
      </div>
    `;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Google Maps Not Available
            </h3>
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
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full" />

      {/* Map overlay controls */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{properties.length} properties on map</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

GoogleMapsIntegration.displayName = "GoogleMapsIntegration";
