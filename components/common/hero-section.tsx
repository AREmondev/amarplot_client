"use client";

import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, LocateFixed } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/lib/constants";
import { useTranslation } from "react-i18next";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import { ensureGoogleMapsLoaded } from "@/lib/google-maps-loader";

// Memoized stat item component
const StatItem = memo(({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
      {value}
    </div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
));
StatItem.displayName = "StatItem";

export const HeroSection = memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const router = useRouter();
  const autocomplete = useGooglePlacesAutocomplete();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Enhanced useTranslation with Bengali as primary
  const { t, i18n, ready } = useTranslation([
    "common",
    "navigation",
    "forms",
    "constants",
  ]);

  // Memoized stats data with translations
  const statsData = useMemo(
    () => [
      { value: "10K+", label: t("hero.stats.properties_listed") },
      { value: "5K+", label: t("hero.stats.happy_customers") },
      { value: "50+", label: t("hero.stats.cities_covered") },
      { value: "24/7", label: t("hero.stats.support_available") },
    ],
    [t],
  );

  const reverseGeocodeCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    console.log("latitude", latitude);
    console.log("longitude", longitude);

    // Ensure Google Maps API is loaded before using Geocoder
    const isLoaded = await ensureGoogleMapsLoaded();
    if (
      !isLoaded ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.Geocoder
    ) {
      console.warn("Google Maps Geocoder not available.");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    try {
      const response = await geocoder.geocode({ location: latlng });
      console.log("response", response);
      if (response.results[0]) {
        const addressComponents = response.results[0].address_components;
        let address = "";
        let city = "";
        let neighborhood = "";
        let zip_code = "";

        for (const component of addressComponents) {
          if (
            component.types.includes("street_address") ||
            component.types.includes("route") ||
            component.types.includes("premise")
          ) {
            address = `${component.long_name} ${address}`;
          } else if (
            component.types.includes("sublocality_level_1") ||
            component.types.includes("sublocality")
          ) {
            neighborhood = component.long_name;
          } else if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2")
          ) {
            city = component.long_name;
          } else if (component.types.includes("postal_code")) {
            zip_code = component.long_name;
          }
        }
        // Fallback for address if street_address/route not found
        if (!address && response.results[0].formatted_address) {
          address = response.results[0].formatted_address.split(",")[0] || "";
        }

        return {
          address: address.trim(),
          city: city,
          neighborhood: neighborhood,
          zip_code: zip_code,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  // Memoized search handler
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("location", searchQuery);
    if (propertyType) params.set("type", propertyType);
    if (transactionType) params.set("transaction_type", transactionType);

    router.push(`/search?${params.toString()}`);
  }, [searchQuery, propertyType, transactionType, router]);

  // Optimized search query handler with debouncing
  const handleSearchQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      autocomplete.setInputValue(value);
      setShowSuggestions(true);
    },
    [autocomplete],
  );

  // Handle current location detection
  const handleCurrentLocation = useCallback(() => {
    setIsGeocoding(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocodeCoordinates(latitude, longitude);
          console.log("location", location);

          if (location && location.address && location.city) {
            setSearchQuery(`${location.address}, ${location.city}`);
            autocomplete.setInputValue(`${location.address}, ${location.city}`);
          } else {
            const fallbackAddress = `Current Location (${latitude.toFixed(
              4,
            )}, ${longitude.toFixed(4)})`;
            setSearchQuery(fallbackAddress);
            autocomplete.setInputValue(fallbackAddress);
          }

          setShowSuggestions(false);
          setIsGeocoding(false);
          // In a real app, you'd reverse geocode these coordinates
          // const locationText = `Current Location (${latitude.toFixed(
          //   4
          // )}, ${longitude.toFixed(4)})`;

          // setSearchQuery(locationText);

          setShowSuggestions(false);
          setIsGeocoding(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setIsGeocoding(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    } else {
      setIsGeocoding(false);
    }
  }, [autocomplete]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized stats rendering
  const statsElements = useMemo(
    () =>
      statsData.map((stat, index) => (
        <StatItem key={index} value={stat.value} label={stat.label} />
      )),
    [statsData],
  );

  const propertyTypeOptions = PROPERTY_TYPES.map((type) => (
    <SelectItem key={type.value} value={type.value}>
      {t(`constants:property_types.${type.value}`, {
        defaultValue: type.label,
      })}
    </SelectItem>
  ));

  // Memoized transaction type options with translations
  const transactionTypeOptions = useMemo(
    () =>
      TRANSACTION_TYPES.map((type) => (
        <SelectItem key={type.value} value={type.value}>
          {t(`constants:transaction_types.${type.value}`, {
            defaultValue: type.label,
          })}
        </SelectItem>
      )),
    [i18n.language, t],
  );

  // Language toggle function - Bengali first
  const toggleLanguage = useCallback(() => {
    const currentPath = window.location.pathname;
    const isEnglish = i18n.language === "en" || currentPath.startsWith("/en");

    if (isEnglish) {
      // Switch to Bengali (remove /en prefix)
      const newPath = currentPath.startsWith("/en")
        ? currentPath.replace("/en", "") || "/"
        : "/";
      i18n.changeLanguage("bn");
      window.location.href = newPath;
    } else {
      // Switch to English (add /en prefix)
      const newPath = `/en${currentPath}`;
      i18n.changeLanguage("en");
      window.location.href = newPath;
    }
  }, [i18n]);

  // Don't render until translations are ready
  if (!ready) {
    return (
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-48"></div>
              <div className="h-16 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded mb-12 mx-auto w-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-15">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-12">
            <Badge variant="secondary" className="mb-4">
              {t("hero.badge")}
            </Badge>
            <h1
              className="font-heading text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              dir={i18n.language === "bn" ? "ltr" : "ltr"} // Bengali can be LTR for this context
            >
              {t("hero.title")}
            </h1>
            <p
              className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
              dir={i18n.language === "bn" ? "ltr" : "ltr"}
            >
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-card rounded-2xl shadow-card p-6 lg:p-8 border">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2">
                <div className="relative" ref={suggestionsRef}>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={t("hero.search_placeholder")}
                    value={autocomplete.inputValue}
                    onChange={(e) => {
                      autocomplete.setInputValue(e.target.value);
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    className="pl-10 h-12"
                    dir="ltr" // Keep search input LTR for better UX
                  />
                  {autocomplete.loading && (
                    <p className="text-sm text-gray-500 mt-1">{t("loading")}</p>
                  )}
                  {autocomplete.error && (
                    <p className="text-sm text-red-500 mt-1">
                      {autocomplete.error}
                    </p>
                  )}
                  {showSuggestions && (
                    <ul className="absolute top-full left-0 right-0 border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto bg-white z-20 shadow-lg">
                      <li className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        <button
                          onClick={handleCurrentLocation}
                          disabled={isGeocoding}
                          className="w-full text-left flex items-center"
                        >
                          <LocateFixed className="w-4 h-4 mr-2" />
                          {isGeocoding
                            ? t("loading")
                            : t("use_current_location")}
                        </button>
                      </li>
                      {autocomplete.predictions.length > 0
                        ? autocomplete.predictions.map((prediction) => (
                            <li
                              key={prediction.place_id}
                              className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                              onClick={async () => {
                                const details =
                                  await autocomplete.getPlaceDetails(
                                    prediction.place_id,
                                  );
                                if (details) {
                                  setSearchQuery(details.address);
                                  autocomplete.setInputValue(details.address);
                                  setShowSuggestions(false);
                                }
                              }}
                            >
                              <div className="font-semibold text-left text-gray-800">
                                {prediction.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-left text-gray-600">
                                {
                                  prediction.structured_formatting
                                    .secondary_text
                                }
                              </div>
                            </li>
                          ))
                        : autocomplete.inputValue &&
                          !autocomplete.loading && (
                            <li className="p-2 text-gray-500 italic">
                              {t("no_results_found")}
                            </li>
                          )}
                    </ul>
                  )}
                </div>
              </div>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={t("hero.property_type_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>{propertyTypeOptions}</SelectContent>
              </Select>

              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={t("hero.transaction_type_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>{transactionTypeOptions}</SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSearch}
                className="w-full flex-1 sm:w-auto px-8 h-12 text-base font-medium"
              >
                <Search className="mr-2 h-5 w-5" />
                {t("hero.search_button")}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {statsElements}
          </div>

          {/* Language Toggle Button - Show English as secondary option */}
          {/* <div className="mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-muted-foreground hover:text-foreground"
            >
              {i18n.language === "bn" ? "🇺🇸 English" : "🇧🇩 বাংলা"}
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
