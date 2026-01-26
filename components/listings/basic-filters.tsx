// components/listings/basic-filters.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { useSearchParamsManager } from "@/hooks/use-search-params"; // Import the custom hook
import { PROPERTY_TYPES, CITIES, NEIGHBORHOODS, ROOM_OPTIONS } from "@/lib/constants";

export default function BasicFilters() {
  const { updateSearchParams, getParam, getAllParams } = useSearchParamsManager();

  // Initialize state from URL params
  const initialMinPrice = Number(getParam("minPrice")) || 0;
  const initialMaxPrice = Number(getParam("maxPrice")) || 10000000;
  const initialPropertyTypes = getParam("propertyType")?.split(',') || [];
  const initialCity = getParam("city") || "";
  const initialMinBedrooms = getParam("minBedrooms") || "any";
  const initialMaxBedrooms = getParam("maxBedrooms") || "any";
  const initialMinBathrooms = getParam("minBathrooms") || "any";
  const initialMaxBathrooms = getParam("maxBathrooms") || "any";
  const initialNeighborhood = getParam("neighborhood") || "";
  const initialMinLotSize = getParam("minLotSize") || "";
  const initialMaxLotSize = getParam("maxLotSize") || "";
  const initialSearchTerm = getParam("search") || "";


  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialPropertyTypes);
  const [city, setCity] = useState<string>(initialCity);
  const [neighborhood, setNeighborhood] = useState<string>(initialNeighborhood);
  const [minBedrooms, setMinBedrooms] = useState<string>(initialMinBedrooms);
  const [maxBedrooms, setMaxBedrooms] = useState<string>(initialMaxBedrooms);
  const [minBathrooms, setMinBathrooms] = useState<string>(initialMinBathrooms);
  const [maxBathrooms, setMaxBathrooms] = useState<string>(initialMaxBathrooms);
  const [minLotSize, setMinLotSize] = useState<string>(initialMinLotSize);
  const [maxLotSize, setMaxLotSize] = useState<string>(initialMaxLotSize);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);




  // Sync local state with URL on initial load
  useEffect(() => {
    setPriceRange([initialMinPrice, initialMaxPrice]);
    setSelectedTypes(initialPropertyTypes);
    setCity(initialCity);
    setNeighborhood(initialNeighborhood);
    setMinBedrooms(initialMinBedrooms);
    setMaxBedrooms(initialMaxBedrooms);
    setMinBathrooms(initialMinBathrooms);
    setMaxBathrooms(initialMaxBathrooms);
    setMinLotSize(initialMinLotSize);
    setMaxLotSize(initialMaxLotSize);
    setSearchTerm(initialSearchTerm);
  }, [getAllParams()]); // Re-run when all params potentially change

  const handleTypeChange = (type: string, checked: boolean) => {
    const newSelectedTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type);
    setSelectedTypes(newSelectedTypes);
    updateSearchParams("propertyType", newSelectedTypes.join(','));
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    updateSearchParams("minPrice", value[0]);
    updateSearchParams("maxPrice", value[1]);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    updateSearchParams("city", value);
  };

  const handleNeighborhoodChange = (value: string) => {
    setNeighborhood(value);
    updateSearchParams("neighborhood", value);
  };

  const handleMinBedroomsChange = (value: string) => {
    setMinBedrooms(value);
    updateSearchParams("minBedrooms", value === "any" ? null : value);
  };

  const handleMaxBedroomsChange = (value: string) => {
    setMaxBedrooms(value);
    updateSearchParams("maxBedrooms", value === "any" ? null : value);
  };

  const handleMinBathroomsChange = (value: string) => {
    setMinBathrooms(value);
    updateSearchParams("minBathrooms", value === "any" ? null : value);
  };

  const handleMaxBathroomsChange = (value: string) => {
    setMaxBathrooms(value);
    updateSearchParams("maxBathrooms", value === "any" ? null : value);
  };

  const handleMinLotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinLotSize(e.target.value);
    updateSearchParams("minLotSize", e.target.value);
  };

  const handleMaxLotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxLotSize(e.target.value);
    updateSearchParams("maxLotSize", e.target.value);
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateSearchParams("search", e.target.value);
  };

  const clearAllFilters = () => {
    // This is a simplified clear. For a full clear, you'd iterate and delete all relevant params.
    updateSearchParams("minPrice", null);
    updateSearchParams("maxPrice", null);
    updateSearchParams("propertyType", null);
    updateSearchParams("city", null);
    updateSearchParams("neighborhood", null);
    updateSearchParams("minBedrooms", null);
    updateSearchParams("maxBedrooms", null);
    updateSearchParams("minBathrooms", null);
    updateSearchParams("maxBathrooms", null);
    updateSearchParams("minLotSize", null);
    updateSearchParams("maxLotSize", null);
    updateSearchParams("search", null);
    setPriceRange([0, 10000000]);
    setSelectedTypes([]);
    setCity("");
    setNeighborhood("");
    setMinBedrooms("any");
    setMaxBedrooms("any");
    setMinBathrooms("any");
    setMaxBathrooms("any");
    setMinLotSize("");
    setMaxLotSize("");
    setSearchTerm("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Basic Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium mb-3 block">Search</Label>
          <Input
            id="search"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>

        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Property Type</Label>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={(checked) => handleTypeChange(type.value, checked as boolean)}
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm">
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
            onValueChange={handlePriceChange}
            max={10000000}
            min={0}
            step={100000}
            className="w-full"
          />
        </div>

        {/* Location (City) */}
        <div>
          <Label className="text-sm font-medium mb-3 block">City</Label>
          <Select value={city} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location (Neighborhood) */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Neighborhood</Label>
          <Select value={neighborhood} onValueChange={handleNeighborhoodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select neighborhood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {NEIGHBORHOODS.map((neighborhood) => (
                <SelectItem key={neighborhood.value} value={neighborhood.value}>
                  {neighborhood.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={minBedrooms} onValueChange={handleMinBedroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={maxBedrooms} onValueChange={handleMaxBedroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Max" />
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
        </div>

        {/* Bathrooms */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Bathrooms</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={minBathrooms} onValueChange={handleMinBathroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_OPTIONS.slice(0, 5).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={maxBathrooms} onValueChange={handleMaxBathroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Max" />
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
        </div>

        {/* Lot Size */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Lot Size (sq ft)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min" type="number" value={minLotSize} onChange={handleMinLotSizeChange} />
            <Input placeholder="Max" type="number" value={maxLotSize} onChange={handleMaxLotSizeChange} />
          </div>
        </div>

        {/* Clear All Button */}
        <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </CardContent>
    </Card>
  );
}
