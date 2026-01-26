// lib/constants/index.ts
// Centralized constants for dropdowns, enums, and filter attributes

// Property Types
export const PROPERTY_TYPES = [
  { value: "Land", label: "Land" },
  { value: "Flat", label: "Flat" },
  { value: "Plot", label: "Plot" },
  { value: "Mess", label: "Mess" },
  { value: "House", label: "House" },
] as const;

export const PROPERTY_TYPE_VALUES = PROPERTY_TYPES.map(type => type.value);

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: "Sell", label: "For Sale" },
  { value: "Rent", label: "For Rent" },
] as const;

export const TRANSACTION_TYPE_VALUES = TRANSACTION_TYPES.map(type => type.value);

// Locations
export const CITIES = [
  { value: "Dhaka", label: "Dhaka" },
  { value: "Chittagong", label: "Chittagong" },
  { value: "Sylhet", label: "Sylhet" },
  { value: "Rajshahi", label: "Rajshahi" },
  { value: "Khulna", label: "Khulna" },
] as const;

export const CITY_VALUES = CITIES.map(city => city.value);

// Neighborhoods (Dhaka-focused, can be expanded)
export const NEIGHBORHOODS = [
  { value: "Gulshan", label: "Gulshan" },
  { value: "Banani", label: "Banani" },
  { value: "Dhanmondi", label: "Dhanmondi" },
  { value: "Mirpur", label: "Mirpur" },
  { value: "Uttara", label: "Uttara" },
  { value: "Agrabad", label: "Agrabad" },
] as const;

export const NEIGHBORHOOD_VALUES = NEIGHBORHOODS.map(neighborhood => neighborhood.value);

// Bedrooms/Bathrooms Options
export const ROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5+" },
] as const;

export const ROOM_PLUS_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
] as const;

// Furnishing Types
export const FURNISHING_TYPES = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-furnished" },
  { value: "fully-furnished", label: "Fully-furnished" },
] as const;

export const FURNISHING_TYPE_VALUES = FURNISHING_TYPES.map(type => type.value);

// Construction Status
export const CONSTRUCTION_STATUSES = [
  { value: "Ready to Move", label: "Ready to Move" },
  { value: "Under Construction", label: "Under Construction" },
  { value: "Upcoming", label: "Upcoming" },
] as const;

export const CONSTRUCTION_STATUS_VALUES = CONSTRUCTION_STATUSES.map(status => status.value);

// Facing Directions
export const FACING_DIRECTIONS = [
  { value: "North", label: "North" },
  { value: "South", label: "South" },
  { value: "East", label: "East" },
  { value: "West", label: "West" },
  { value: "North-East", label: "North-East" },
  { value: "North-West", label: "North-West" },
  { value: "South-East", label: "South-East" },
  { value: "South-West", label: "South-West" },
] as const;

export const FACING_DIRECTION_VALUES = FACING_DIRECTIONS.map(direction => direction.value);

// Property Conditions
export const PROPERTY_CONDITIONS = [
  { value: "New", label: "New" },
  { value: "Resale", label: "Resale" },
  { value: "Used", label: "Used" },
  { value: "Renovated", label: "Renovated" },
] as const;

export const PROPERTY_CONDITION_VALUES = PROPERTY_CONDITIONS.map(condition => condition.value);

// Common Amenities
export const AMENITIES = [
  { value: "Parking", label: "Parking" },
  { value: "Lift", label: "Lift" },
  { value: "Security", label: "Security" },
  { value: "Gym", label: "Gym" },
  { value: "Swimming Pool", label: "Swimming Pool" },
  { value: "Balcony", label: "Balcony" },
  { value: "Garden", label: "Garden" },
  { value: "Playground", label: "Playground" },
  { value: "Community Hall", label: "Community Hall" },
  { value: "Backup Generator", label: "Backup Generator" },
  { value: "CCTV", label: "CCTV" },
  { value: "Intercom", label: "Intercom" },
] as const;

export const AMENITY_VALUES = AMENITIES.map(amenity => amenity.value);

// Nearby Place Types
export const NEARBY_PLACE_TYPES = [
  { value: "Hospital", label: "Hospital" },
  { value: "School", label: "School" },
  { value: "Market", label: "Market" },
  { value: "Transport", label: "Transport" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Other", label: "Other" },
] as const;

export const NEARBY_PLACE_TYPE_VALUES = NEARBY_PLACE_TYPES.map(type => type.value);

// Legal Verification Status
export const LEGAL_VERIFICATION_STATUSES = [
  { value: "Verified", label: "Verified" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
] as const;

export const LEGAL_VERIFICATION_STATUS_VALUES = LEGAL_VERIFICATION_STATUSES.map(status => status.value);

// Property Status
export const PROPERTY_STATUSES = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
] as const;

export const PROPERTY_STATUS_VALUES = PROPERTY_STATUSES.map(status => status.value);

// Sort Options
export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price", label: "Price" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "views_count", label: "Views" },
  { value: "favorites_count", label: "Favorites" },
  { value: "name", label: "Name A-Z" },
  { value: "progress", label: "Most Progress" },
  { value: "relevance", label: "Most Relevant" },
] as const;

// Map-specific sort options (subset of SORT_OPTIONS)
export const MAP_SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
] as const;

// Price Ranges (for quick filters)
export const PRICE_RANGES = [
  { value: "0-500000", label: "Under ₹5 Lakh" },
  { value: "500000-1000000", label: "₹5-10 Lakh" },
  { value: "1000000-2000000", label: "₹10-20 Lakh" },
  { value: "2000000-5000000", label: "₹20-50 Lakh" },
  { value: "5000000-10000000", label: "₹50 Lakh - 1 Crore" },
  { value: "10000000+", label: "Above ₹1 Crore" },
] as const;

// Pagination Options
export const PAGINATION_OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
] as const;

// Community Categories
export const COMMUNITY_CATEGORIES = [
  { value: "Investment", label: "Investment" },
  { value: "Student", label: "Student" },
  { value: "Regional", label: "Regional" },
  { value: "Professional", label: "Professional" },
  { value: "Business", label: "Business" },
  { value: "Educational", label: "Educational" },
] as const;

// Community Sort Options
export const COMMUNITY_SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "members", label: "Most Members" },
  { value: "activity", label: "Most Active" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name A-Z" },
] as const;

// User Types
export const USER_TYPES = [
  { value: "student", label: "Student" },
  { value: "businessman", label: "Businessman" },
  { value: "job_holder", label: "Job Holder" },
  { value: "investor", label: "Investor" },
  { value: "other", label: "Other" },
] as const;

// Document Types (for verification)
export const DOCUMENT_TYPES = [
  { value: "nid", label: "National ID" },
  { value: "smart_nid", label: "Smart NID" },
  { value: "passport", label: "Passport" },
  { value: "birth_certificate", label: "Birth Certificate" },
] as const;

// Filter Labels (for display)
export const FILTER_LABELS = {
  propertyType: "Property Type",
  transactionType: "Transaction Type",
  city: "City",
  neighborhood: "Neighborhood",
  minPrice: "Min Price",
  maxPrice: "Max Price",
  minBedrooms: "Min Bedrooms",
  maxBedrooms: "Max Bedrooms",
  minBathrooms: "Min Bathrooms",
  maxBathrooms: "Max Bathrooms",
  furnishingType: "Furnishing",
  constructionStatus: "Construction Status",
  facingDirection: "Facing Direction",
  propertyCondition: "Condition",
  amenities: "Amenities",
  isVerified: "Verified",
  isUrgentSale: "Urgent Sale",
  isFurnished: "Furnished",
  hasParking: "Parking",
  isNewConstruction: "New Construction",
  isReadyToMove: "Ready to Move",
  isFeatured: "Featured",
  isHotProduct: "Hot Deal",
  minLotSize: "Min Lot Size",
  maxLotSize: "Max Lot Size",
  minYearBuilt: "Min Year Built",
  maxYearBuilt: "Max Year Built",
  minFloorNumber: "Min Floor",
  maxFloorNumber: "Max Floor",
  minTotalFloors: "Min Total Floors",
  maxTotalFloors: "Max Total Floors",
  minViewsCount: "Min Views",
  maxViewsCount: "Max Views",
  minFavoritesCount: "Min Favorites",
  maxFavoritesCount: "Max Favorites",
  search: "Search",
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PRICE_MIN: 0,
  PRICE_MAX: 10000000,
  PRICE_STEP: 100000,
  PAGINATION_DEFAULT: 20,
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// Helper functions
export const getPropertyTypeLabel = (value: string) => {
  return PROPERTY_TYPES.find(type => type.value === value)?.label || value;
};

export const getTransactionTypeLabel = (value: string) => {
  return TRANSACTION_TYPES.find(type => type.value === value)?.label || value;
};

export const getCityLabel = (value: string) => {
  return CITIES.find(city => city.value === value)?.label || value;
};

export const getAmenityLabel = (value: string) => {
  return AMENITIES.find(amenity => amenity.value === value)?.label || value;
};

export const getFurnishingTypeLabel = (value: string) => {
  return FURNISHING_TYPES.find(type => type.value === value)?.label || value;
};

export const getConstructionStatusLabel = (value: string) => {
  return CONSTRUCTION_STATUSES.find(status => status.value === value)?.label || value;
};

export const getFacingDirectionLabel = (value: string) => {
  return FACING_DIRECTIONS.find(direction => direction.value === value)?.label || value;
};

export const getPropertyConditionLabel = (value: string) => {
  return PROPERTY_CONDITIONS.find(condition => condition.value === value)?.label || value;
};

// Type exports for better TypeScript support
export type PropertyType = typeof PROPERTY_TYPE_VALUES[number];
export type TransactionType = typeof TRANSACTION_TYPE_VALUES[number];
export type City = typeof CITY_VALUES[number];
export type Neighborhood = typeof NEIGHBORHOOD_VALUES[number];
export type FurnishingType = typeof FURNISHING_TYPE_VALUES[number];
export type ConstructionStatus = typeof CONSTRUCTION_STATUS_VALUES[number];
export type FacingDirection = typeof FACING_DIRECTION_VALUES[number];
export type PropertyCondition = typeof PROPERTY_CONDITION_VALUES[number];
export type Amenity = typeof AMENITY_VALUES[number];
export type NearbyPlaceType = typeof NEARBY_PLACE_TYPE_VALUES[number];
export type LegalVerificationStatus = typeof LEGAL_VERIFICATION_STATUS_VALUES[number];
export type PropertyStatus = typeof PROPERTY_STATUS_VALUES[number];