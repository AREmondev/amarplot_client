// lib/utils/filter-utils.ts
// Centralized utilities for filter formatting and validation

import {
  FILTER_LABELS,
  getPropertyTypeLabel,
  getTransactionTypeLabel,
  getCityLabel,
  getAmenityLabel,
  getFurnishingTypeLabel,
  getConstructionStatusLabel,
  getFacingDirectionLabel,
  getPropertyConditionLabel,
} from '@/lib/constants';

/**
 * Format filter values for display
 */
export const formatFilterValue = (key: string, value: string | boolean): string => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  switch (key) {
    case 'propertyType':
      return getPropertyTypeLabel(value);
    
    case 'transactionType':
      return getTransactionTypeLabel(value);
    
    case 'city':
      return getCityLabel(value);
    
    case 'furnishingType':
      return getFurnishingTypeLabel(value);
    
    case 'constructionStatus':
      return getConstructionStatusLabel(value);
    
    case 'facingDirection':
      return getFacingDirectionLabel(value);
    
    case 'propertyCondition':
      return getPropertyConditionLabel(value);
    
    case 'amenities':
      // Handle comma-separated amenities
      return value.split(',').map(amenity => getAmenityLabel(amenity.trim())).join(', ');
    
    case 'minPrice':
    case 'maxPrice':
      return `₹${Number(value).toLocaleString()}`;
    
    case 'minBedrooms':
    case 'maxBedrooms':
    case 'minBathrooms':
    case 'maxBathrooms':
      return value === 'any' ? 'Any' : `${value}${key.includes('min') ? '+' : ''}`;
    
    case 'minLotSize':
    case 'maxLotSize':
      return `${value} sq ft`;
    
    case 'minYearBuilt':
    case 'maxYearBuilt':
      return value;
    
    case 'minFloorNumber':
    case 'maxFloorNumber':
    case 'minTotalFloors':
    case 'maxTotalFloors':
      return `Floor ${value}`;
    
    case 'minViewsCount':
    case 'maxViewsCount':
      return `${value} views`;
    
    case 'minFavoritesCount':
    case 'maxFavoritesCount':
      return `${value} favorites`;
    
    default:
      return value;
  }
};

/**
 * Get filter label for display
 */
export const getFilterLabel = (key: string): string => {
  return FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;
};

/**
 * Parse comma-separated values into array
 */
export const parseCommaSeparatedValues = (value: string | null): string[] => {
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(Boolean);
};

/**
 * Convert array to comma-separated string
 */
export const arrayToCommaSeparated = (values: string[]): string => {
  return values.filter(Boolean).join(',');
};

/**
 * Validate price range
 */
export const validatePriceRange = (min: number, max: number): { isValid: boolean; error?: string } => {
  if (min < 0) {
    return { isValid: false, error: 'Minimum price cannot be negative' };
  }
  if (max < min) {
    return { isValid: false, error: 'Maximum price cannot be less than minimum price' };
  }
  return { isValid: true };
};

/**
 * Validate room count
 */
export const validateRoomCount = (min: string, max: string): { isValid: boolean; error?: string } => {
  if (min === 'any' || max === 'any') {
    return { isValid: true };
  }
  
  const minNum = parseInt(min);
  const maxNum = parseInt(max);
  
  if (isNaN(minNum) || isNaN(maxNum)) {
    return { isValid: false, error: 'Room count must be a valid number' };
  }
  
  if (maxNum < minNum) {
    return { isValid: false, error: 'Maximum rooms cannot be less than minimum rooms' };
  }
  
  return { isValid: true };
};

/**
 * Validate year range
 */
export const validateYearRange = (min: string, max: string): { isValid: boolean; error?: string } => {
  if (!min && !max) {
    return { isValid: true };
  }
  
  const currentYear = new Date().getFullYear();
  const minYear = min ? parseInt(min) : 1900;
  const maxYear = max ? parseInt(max) : currentYear;
  
  if (minYear < 1900 || minYear > currentYear) {
    return { isValid: false, error: 'Minimum year must be between 1900 and current year' };
  }
  
  if (maxYear < 1900 || maxYear > currentYear + 10) {
    return { isValid: false, error: 'Maximum year must be between 1900 and 10 years from now' };
  }
  
  if (maxYear < minYear) {
    return { isValid: false, error: 'Maximum year cannot be less than minimum year' };
  }
  
  return { isValid: true };
};

/**
 * Clean filter object by removing empty/null/undefined values
 */
export const cleanFilters = (filters: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '' && value !== 'any') {
      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length > 0) {
          cleaned[key] = value;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

/**
 * Convert filters to URL search params
 */
export const filtersToSearchParams = (filters: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  const cleanedFilters = cleanFilters(filters);
  
  Object.entries(cleanedFilters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  });
  
  return params;
};

/**
 * Convert URL search params to filters object
 */
export const searchParamsToFilters = (searchParams: URLSearchParams): Record<string, any> => {
  const filters: Record<string, any> = {};
  
  searchParams.forEach((value, key) => {
    // Handle comma-separated values for arrays
    if (['propertyType', 'amenities'].includes(key)) {
      filters[key] = parseCommaSeparatedValues(value);
    } else if (['minPrice', 'maxPrice', 'minBedrooms', 'maxBedrooms', 'minBathrooms', 'maxBathrooms'].includes(key)) {
      // Handle numeric values
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        filters[key] = numValue;
      }
    } else if (['isVerified', 'isUrgentSale', 'isFurnished', 'hasParking', 'isNewConstruction', 'isReadyToMove', 'isFeatured', 'isHotProduct'].includes(key)) {
      // Handle boolean values
      filters[key] = value === 'true';
    } else {
      filters[key] = value;
    }
  });
  
  return filters;
};

/**
 * Get active filters count
 */
export const getActiveFiltersCount = (filters: Record<string, any>): number => {
  return Object.keys(cleanFilters(filters)).length;
};

/**
 * Check if filters are empty
 */
export const areFiltersEmpty = (filters: Record<string, any>): boolean => {
  return getActiveFiltersCount(filters) === 0;
};

/**
 * Reset specific filter categories
 */
export const resetFilterCategory = (filters: Record<string, any>, category: 'price' | 'rooms' | 'location' | 'features'): Record<string, any> => {
  const newFilters = { ...filters };
  
  switch (category) {
    case 'price':
      delete newFilters.minPrice;
      delete newFilters.maxPrice;
      break;
    case 'rooms':
      delete newFilters.minBedrooms;
      delete newFilters.maxBedrooms;
      delete newFilters.minBathrooms;
      delete newFilters.maxBathrooms;
      break;
    case 'location':
      delete newFilters.city;
      delete newFilters.neighborhood;
      break;
    case 'features':
      delete newFilters.amenities;
      delete newFilters.isVerified;
      delete newFilters.isFurnished;
      delete newFilters.hasParking;
      break;
  }
  
  return newFilters;
};

/**
 * Generate filter summary text
 */
export const generateFilterSummary = (filters: Record<string, any>): string => {
  const activeFilters = cleanFilters(filters);
  const count = Object.keys(activeFilters).length;
  
  if (count === 0) {
    return 'No filters applied';
  }
  
  if (count === 1) {
    const [key, value] = Object.entries(activeFilters)[0];
    return `Filtered by ${getFilterLabel(key)}: ${formatFilterValue(key, value)}`;
  }
  
  return `${count} filters applied`;
};