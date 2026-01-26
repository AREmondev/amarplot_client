"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, LocateFixed } from "lucide-react";
import { LocationPickerMap } from "@/components/map/location-picker-map";
import { useFormContext } from "react-hook-form";
import { ListingFormData, CoordinatesSchema } from "@/lib/schemas/property";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import { useTranslation } from "react-i18next";
import { useState } from "react";
interface LocationDetailsStepProps {
  reverseGeocodeCoordinates: (
    latitude: number,
    longitude: number
  ) => Promise<{
    address: string;
    city: string;
    neighborhood: string;
    zip_code: string;
  } | null>;
}

export function LocationDetailsStep({
  reverseGeocodeCoordinates,
}: LocationDetailsStepProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ListingFormData>();
  const formData = watch();
  const autocomplete = useGooglePlacesAutocomplete();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleCurrentLocation = () => {
    setIsGeocoding(true);
    console.log("navigator.geolocation", navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geocoded = await reverseGeocodeCoordinates(latitude, longitude);
          console.log("location", geocoded);
          if (geocoded) {
            setValue("location.address", geocoded.address);
            setValue("location.city", geocoded.city);
            setValue("location.neighborhood", geocoded.neighborhood);
            setValue("location.zip_code", geocoded.zip_code);
            setValue("location.coordinates", { latitude, longitude });
            autocomplete.setInputValue(geocoded.address);
          }
          setIsGeocoding(false);
          setShowSuggestions(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          // You might want to show a toast or an error message to the user
          setIsGeocoding(false);
        }
      );
    } else {
      // Geolocation is not supported by this browser.
      // You might want to show a toast or an error message to the user
      setIsGeocoding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Location Details
        </h2>
        <p className="text-gray-600">Help buyers find your property.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="address">{t("search_address")} *</Label>
          <Input
            onFocus={() => setShowSuggestions(true)}
            id="address"
            placeholder="Start typing an address..."
            value={autocomplete.inputValue}
            onChange={(e) => {
              autocomplete.setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
          />
          {autocomplete.loading && (
            <p className="text-sm text-gray-500">Loading suggestions...</p>
          )}
          {autocomplete.error && (
            <p className="text-sm text-red-500">{autocomplete.error}</p>
          )}
          {showSuggestions && (
            <ul className="border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto bg-white z-10 relative shadow-lg">
              <li className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                <button
                  onClick={handleCurrentLocation}
                  disabled={isGeocoding}
                  className="w-full text-left flex items-center"
                >
                  <LocateFixed className="w-4 h-4 mr-2" />
                  {isGeocoding ? t("loading") : t("use_current_location")}
                </button>
              </li>
              {autocomplete.predictions.length > 0 ? (
                autocomplete.predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    className="p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={async () => {
                      const details = await autocomplete.getPlaceDetails(
                        prediction.place_id
                      );
                      if (details) {
                        setValue("location.address", details.address);
                        setValue("location.city", details.city);
                        setValue("location.neighborhood", details.neighborhood);
                        setValue("location.zip_code", details.zip_code);
                        setValue("location.coordinates", details.coordinates);
                        autocomplete.setInputValue(details.address); // Set input to full address

                        setShowSuggestions(false); // Hide suggestions
                      }
                    }}
                  >
                    <div className="font-semibold text-gray-800">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 italic">No results found.</li>
              )}
            </ul>
          )}
          {errors.location?.address && (
            <p className="text-red-500 text-sm">
              {errors.location.address.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="e.g., Dhaka"
            {...register("location.city")}
            // readOnly
          />
          {errors.location?.city && (
            <p className="text-red-500 text-sm">
              {errors.location.city.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="neighborhood">Neighborhood *</Label>
          <Input
            id="neighborhood"
            placeholder="e.g., Gulshan"
            {...register("location.neighborhood")}
          />
          {errors.location?.neighborhood && (
            <p className="text-red-500 text-sm">
              {errors.location.neighborhood.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="zip_code">ZIP Code *</Label>
          <Input
            id="zip_code"
            placeholder="e.g., 1212"
            {...register("location.zip_code")}
          />
          {errors.location?.zip_code && (
            <p className="text-red-500 text-sm">
              {errors.location.zip_code.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <Label>Select Location on Map</Label>
          <LocationPickerMap
            initialCoordinates={
              formData.location?.coordinates || {
                latitude: 23.8103,
                longitude: 90.4125,
              }
            }
            onCoordinatesChange={async (coords) => {
              setValue("location.coordinates", coords);
              const geocoded = await reverseGeocodeCoordinates(
                coords.latitude,
                coords.longitude
              );
              if (geocoded) {
                setValue("location.address", geocoded.address);
                setValue("location.city", geocoded.city);
                setValue("location.neighborhood", geocoded.neighborhood);
                setValue("location.zip_code", geocoded.zip_code);
                autocomplete.setInputValue(geocoded.address); // Update search input with geocoded address
              }
            }}
          />
          {errors.location?.coordinates && (
            <p className="text-red-500 text-sm">
              {errors.location.coordinates.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
