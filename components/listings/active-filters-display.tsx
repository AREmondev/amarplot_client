// components/listings/active-filters-display.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParamsManager } from "@/hooks/use-search-params";
import { useCallback } from "react";
import { formatFilterValue, getFilterLabel, cleanFilters } from "@/lib/utils/filter-utils";

export default function ActiveFiltersDisplay() {
  const { updateSearchParams, getAllParams } = useSearchParamsManager();
  const allParams = getAllParams();

  const activeFilters = useCallback(() => {
    const filters: { key: string; label: string; value: string }[] = [];
    // Exclude pagination and sorting parameters
    const filteredParams = Object.fromEntries(
      Object.entries(allParams).filter(([key]) => 
        !['page', 'limit', 'sortBy', 'sortOrder'].includes(key)
      )
    );
    
    const cleanedFilters = cleanFilters(filteredParams);
    
    for (const [key, value] of Object.entries(cleanedFilters)) {
      filters.push({
        key,
        label: getFilterLabel(key),
        value: formatFilterValue(key, value),
      });
    }
    return filters;
  }, [allParams]);

  const handleRemoveFilter = (key: string) => {
    if (key === "propertyType" || key === "amenities") {
      updateSearchParams(key, null); // Clear multi-selects
    } else if (key === "minPrice" || key === "maxPrice") {
      updateSearchParams("minPrice", null);
      updateSearchParams("maxPrice", null);
    } else if (key === "minBedrooms" || key === "maxBedrooms") {
      updateSearchParams("minBedrooms", null);
      updateSearchParams("maxBedrooms", null);
    } else if (key === "minBathrooms" || key === "maxBathrooms") {
      updateSearchParams("minBathrooms", null);
      updateSearchParams("maxBathrooms", null);
    } else if (key === "minLotSize" || key === "maxLotSize") {
      updateSearchParams("minLotSize", null);
      updateSearchParams("maxLotSize", null);
    } else if (key === "minFloorNumber" || key === "maxFloorNumber") {
      updateSearchParams("minFloorNumber", null);
      updateSearchParams("maxFloorNumber", null);
    } else if (key === "minTotalFloors" || key === "maxTotalFloors") {
      updateSearchParams("minTotalFloors", null);
      updateSearchParams("maxTotalFloors", null);
    } else if (key === "minYearBuilt" || key === "maxYearBuilt") {
      updateSearchParams("minYearBuilt", null);
      updateSearchParams("maxYearBuilt", null);
    } else if (key === "minViewsCount" || key === "maxViewsCount") {
      updateSearchParams("minViewsCount", null);
      updateSearchParams("maxViewsCount", null);
    } else if (key === "minFavoritesCount" || key === "maxFavoritesCount") {
      updateSearchParams("minFavoritesCount", null);
      updateSearchParams("maxFavoritesCount", null);
    } else {
      updateSearchParams(key, null);
    }
  };

  const filters = activeFilters();

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium">Active Filters:</span>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="pr-1">
          {filter.label}: {filter.value}
          <X
            className="ml-1 h-3 w-3 cursor-pointer"
            onClick={() => handleRemoveFilter(filter.key)}
          />
        </Badge>
      ))}
    </div>
  );
}
