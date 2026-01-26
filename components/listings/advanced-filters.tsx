// components/listings/advanced-filters.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParamsManager } from "@/hooks/use-search-params";
import {
  AMENITIES,
  TRANSACTION_TYPES,
  FURNISHING_TYPES,
  CONSTRUCTION_STATUSES,
  FACING_DIRECTIONS,
  PROPERTY_CONDITIONS,
} from "@/lib/constants";

export default function AdvancedFilters() {
  const { updateSearchParams, getParam, getAllParams } = useSearchParamsManager();

  // Initialize state from URL params
  const initialTransactionType = getParam("transactionType") || "";
  const initialFurnishingType = getParam("furnishingType") || "";
  const initialConstructionStatus = getParam("constructionStatus") || "";
  const initialFacingDirection = getParam("facingDirection") || "";
  const initialPropertyCondition = getParam("propertyCondition") || "";
  const initialMinYearBuilt = getParam("minYearBuilt") || "";
  const initialMaxYearBuilt = getParam("maxYearBuilt") || "";
  const initialMinFloorNumber = getParam("minFloorNumber") || "";
  const initialMaxFloorNumber = getParam("maxFloorNumber") || "";
  const initialMinTotalFloors = getParam("minTotalFloors") || "";
  const initialMaxTotalFloors = getParam("maxTotalFloors") || "";
  const initialAmenities = getParam("amenities")?.split(',') || [];

  const initialIsVerified = getParam("isVerified") === 'true';
  const initialIsUrgentSale = getParam("isUrgentSale") === 'true';
  const initialIsFurnished = getParam("isFurnished") === 'true';
  const initialHasParking = getParam("hasParking") === 'true';
  const initialIsNewConstruction = getParam("isNewConstruction") === 'true';
  const initialIsReadyToMove = getParam("isReadyToMove") === 'true';
  const initialIsFeatured = getParam("isFeatured") === 'true';
  const initialIsHotProduct = getParam("isHotProduct") === 'true';
  const initialMinViewsCount = getParam("minViewsCount") || "";
  const initialMaxViewsCount = getParam("maxViewsCount") || "";
  const initialMinFavoritesCount = getParam("minFavoritesCount") || "";
  const initialMaxFavoritesCount = getParam("maxFavoritesCount") || "";


  const [transactionType, setTransactionType] = useState<string>(initialTransactionType);
  const [furnishingType, setFurnishingType] = useState<string>(initialFurnishingType);
  const [constructionStatus, setConstructionStatus] = useState<string>(initialConstructionStatus);
  const [facingDirection, setFacingDirection] = useState<string>(initialFacingDirection);
  const [propertyCondition, setPropertyCondition] = useState<string>(initialPropertyCondition);
  const [minYearBuilt, setMinYearBuilt] = useState<string>(initialMinYearBuilt);
  const [maxYearBuilt, setMaxYearBuilt] = useState<string>(initialMaxYearBuilt);
  const [minFloorNumber, setMinFloorNumber] = useState<string>(initialMinFloorNumber);
  const [maxFloorNumber, setMaxFloorNumber] = useState<string>(initialMaxFloorNumber);
  const [minTotalFloors, setMinTotalFloors] = useState<string>(initialMinTotalFloors);
  const [maxTotalFloors, setMaxTotalFloors] = useState<string>(initialMaxTotalFloors);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialAmenities);

  const [isVerified, setIsVerified] = useState<boolean>(initialIsVerified);
  const [isUrgentSale, setIsUrgentSale] = useState<boolean>(initialIsUrgentSale);
  const [isFurnished, setIsFurnished] = useState<boolean>(initialIsFurnished);
  const [hasParking, setHasParking] = useState<boolean>(initialHasParking);
  const [isNewConstruction, setIsNewConstruction] = useState<boolean>(initialIsNewConstruction);
  const [isReadyToMove, setIsReadyToMove] = useState<boolean>(initialIsReadyToMove);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialIsFeatured);
  const [isHotProduct, setIsHotProduct] = useState<boolean>(initialIsHotProduct);
  const [minViewsCount, setMinViewsCount] = useState<string>(initialMinViewsCount);
  const [maxViewsCount, setMaxViewsCount] = useState<string>(initialMaxViewsCount);
  const [minFavoritesCount, setMinFavoritesCount] = useState<string>(initialMinFavoritesCount);
  const [maxFavoritesCount, setMaxFavoritesCount] = useState<string>(initialMaxFavoritesCount);


  // Sync local state with URL on initial load
  useEffect(() => {
    setTransactionType(initialTransactionType);
    setFurnishingType(initialFurnishingType);
    setConstructionStatus(initialConstructionStatus);
    setFacingDirection(initialFacingDirection);
    setPropertyCondition(initialPropertyCondition);
    setMinYearBuilt(initialMinYearBuilt);
    setMaxYearBuilt(initialMaxYearBuilt);
    setMinFloorNumber(initialMinFloorNumber);
    setMaxFloorNumber(initialMaxFloorNumber);
    setMinTotalFloors(initialMinTotalFloors);
    setMaxTotalFloors(initialMaxTotalFloors);
    setSelectedAmenities(initialAmenities);

    setIsVerified(initialIsVerified);
    setIsUrgentSale(initialIsUrgentSale);
    setIsFurnished(initialIsFurnished);
    setHasParking(initialHasParking);
    setIsNewConstruction(initialIsNewConstruction);
    setIsReadyToMove(initialIsReadyToMove);
    setIsFeatured(initialIsFeatured);
    setIsHotProduct(initialIsHotProduct);
    setMinViewsCount(initialMinViewsCount);
    setMaxViewsCount(initialMaxViewsCount);
    setMinFavoritesCount(initialMinFavoritesCount);
    setMaxFavoritesCount(initialMaxFavoritesCount);
  }, [getAllParams()]);

  const handleCheckboxChange = (paramName: string, checked: boolean) => {
    updateSearchParams(paramName, checked);
  };

  const handleSelectChange = (paramName: string, value: string) => {
    updateSearchParams(paramName, value);
  };

  const handleInputChange = (paramName: string, value: string) => {
    updateSearchParams(paramName, value);
  };

  const handleAmenitiesChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...selectedAmenities, amenity]
      : selectedAmenities.filter((a) => a !== amenity);
    setSelectedAmenities(newAmenities);
    updateSearchParams("amenities", newAmenities.join(','));
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Transaction Type</Label>
          <Select value={transactionType} onValueChange={(val) => { setTransactionType(val); handleSelectChange("transactionType", val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Furnishing Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Furnishing Type</Label>
          <Select value={furnishingType} onValueChange={(val) => { setFurnishingType(val); handleSelectChange("furnishingType", val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {FURNISHING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Construction Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Construction Status</Label>
          <Select value={constructionStatus} onValueChange={(val) => { setConstructionStatus(val); handleSelectChange("constructionStatus", val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {CONSTRUCTION_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Built */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Year Built</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Year" type="number" value={minYearBuilt} onChange={(e) => { setMinYearBuilt(e.target.value); handleInputChange("minYearBuilt", e.target.value); }} />
            <Input placeholder="Max Year" type="number" value={maxYearBuilt} onChange={(e) => { setMaxYearBuilt(e.target.value); handleInputChange("maxYearBuilt", e.target.value); }} />
          </div>
        </div>

        {/* Floor Number */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Floor Number</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Floor" type="number" value={minFloorNumber} onChange={(e) => { setMinFloorNumber(e.target.value); handleInputChange("minFloorNumber", e.target.value); }} />
            <Input placeholder="Max Floor" type="number" value={maxFloorNumber} onChange={(e) => { setMaxFloorNumber(e.target.value); handleInputChange("maxFloorNumber", e.target.value); }} />
          </div>
        </div>

        {/* Total Floors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Total Floors (Building)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Total" type="number" value={minTotalFloors} onChange={(e) => { setMinTotalFloors(e.target.value); handleInputChange("minTotalFloors", e.target.value); }} />
            <Input placeholder="Max Total" type="number" value={maxTotalFloors} onChange={(e) => { setMaxTotalFloors(e.target.value); handleInputChange("maxTotalFloors", e.target.value); }} />
          </div>
        </div>

        {/* Facing Direction */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Facing Direction</Label>
          <Select value={facingDirection} onValueChange={(val) => { setFacingDirection(val); handleSelectChange("facingDirection", val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {FACING_DIRECTIONS.map((direction) => (
                <SelectItem key={direction.value} value={direction.value}>
                  {direction.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Condition */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Property Condition</Label>
          <Select value={propertyCondition} onValueChange={(val) => { setPropertyCondition(val); handleSelectChange("propertyCondition", val); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {PROPERTY_CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Views Count */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Views Count</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Views" type="number" value={minViewsCount} onChange={(e) => { setMinViewsCount(e.target.value); handleInputChange("minViewsCount", e.target.value); }} />
            <Input placeholder="Max Views" type="number" value={maxViewsCount} onChange={(e) => { setMaxViewsCount(e.target.value); handleInputChange("maxViewsCount", e.target.value); }} />
          </div>
        </div>

        {/* Favorites Count */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Favorites Count</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min Favorites" type="number" value={minFavoritesCount} onChange={(e) => { setMinFavoritesCount(e.target.value); handleInputChange("minFavoritesCount", e.target.value); }} />
            <Input placeholder="Max Favorites" type="number" value={maxFavoritesCount} onChange={(e) => { setMaxFavoritesCount(e.target.value); handleInputChange("maxFavoritesCount", e.target.value); }} />
          </div>
        </div>

        {/* Boolean Filters */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="isVerified" checked={isVerified} onCheckedChange={(checked) => { setIsVerified(checked as boolean); handleCheckboxChange("isVerified", checked as boolean); }} />
            <Label htmlFor="isVerified">Verified Properties</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isUrgentSale" checked={isUrgentSale} onCheckedChange={(checked) => { setIsUrgentSale(checked as boolean); handleCheckboxChange("isUrgentSale", checked as boolean); }} />
            <Label htmlFor="isUrgentSale">Urgent Sales</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isFurnished" checked={isFurnished} onCheckedChange={(checked) => { setIsFurnished(checked as boolean); handleCheckboxChange("isFurnished", checked as boolean); }} />
            <Label htmlFor="isFurnished">Furnished</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hasParking" checked={hasParking} onCheckedChange={(checked) => { setHasParking(checked as boolean); handleCheckboxChange("hasParking", checked as boolean); }} />
            <Label htmlFor="hasParking">Parking Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isNewConstruction" checked={isNewConstruction} onCheckedChange={(checked) => { setIsNewConstruction(checked as boolean); handleCheckboxChange("isNewConstruction", checked as boolean); }} />
            <Label htmlFor="isNewConstruction">New Construction</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isReadyToMove" checked={isReadyToMove} onCheckedChange={(checked) => { setIsReadyToMove(checked as boolean); handleCheckboxChange("isReadyToMove", checked as boolean); }} />
            <Label htmlFor="isReadyToMove">Ready to Move</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" checked={isFeatured} onCheckedChange={(checked) => { setIsFeatured(checked as boolean); handleCheckboxChange("isFeatured", checked as boolean); }} />
            <Label htmlFor="isFeatured">Featured Properties</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isHotProduct" checked={isHotProduct} onCheckedChange={(checked) => { setIsHotProduct(checked as boolean); handleCheckboxChange("isHotProduct", checked as boolean); }} />
            <Label htmlFor="isHotProduct">Hot Deals</Label>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map((amenity) => (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity.value}`}
                  checked={selectedAmenities.includes(amenity.value)}
                  onCheckedChange={(checked) => handleAmenitiesChange(amenity.value, checked as boolean)}
                />
                <Label htmlFor={`amenity-${amenity.value}`} className="text-sm">
                  {amenity.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}