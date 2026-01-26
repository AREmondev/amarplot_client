import api from "./axios";
import { PropertyType, TransactionType } from "../constants";
interface PropertySearchParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  city?: string;
  neighborhood?: string;
  isFeatured?: boolean;
  isHotProduct?: boolean;
  isVerified?: boolean;
  isUrgentSale?: boolean;
  isFurnished?: boolean;
  hasParking?: boolean;
  isNewConstruction?: boolean;
  isReadyToMove?: boolean;
  furnishingType?: string;
  amenities?: string; // Comma-separated
  minLotSize?: string;
  maxLotSize?: string;
  minFloorNumber?: number;
  maxFloorNumber?: number;
  minTotalFloors?: number;
  maxTotalFloors?: number;
  constructionStatus?: string;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  facingDirection?: string;
  propertyCondition?: string;
  minViewsCount?: number;
  maxViewsCount?: number;
  minFavoritesCount?: number;
  maxFavoritesCount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // Add other parameters as needed
}

export interface Property {
  _id: string; // This will be the MongoDB _id, derived from listing_id if needed
  listing_id: string; // From your mock data
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    neighborhood: string;
    zip_code: string;
    coordinates:
      | { latitude: string; longitude: string } // Old format
      | { type: string; coordinates: [number, number] }; // GeoJSON format [lng, lat]
  };
  property_type: string;
  transaction_type: string;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  posted_date: string;
  legal_verification: {
    status: string;
    details: string;
  };
  amenities: string[];
  nearby_facilities: { name: string; type: string; distance: string }[];
  construction_status: string;
  is_featured: boolean;
  is_verified: boolean;

  // Installment information
  installment?: {
    available: boolean;
    duration_months?: number;
    down_payment_percentage?: number;
    monthly_amount?: number;
    service_details?: string;
    terms_and_conditions?: string;
  };

  // Fields that might come from backend but not in mock, made optional
  unit_number?: string;
  holding_number?: string;
  year_built?: number;
  facing_direction?: string;
  property_condition?: string;
  eco_features?: string[];
  smart_features?: string[];
  status?: string;
  isFeatured?: boolean; // Backend uses this, mock uses is_featured
  isHotProduct?: boolean;
  lastBumped?: string;
  createdAt?: string; // Backend uses this, mock uses posted_date
  updatedAt?: string;
  isVerified?: boolean; // Backend uses this, mock uses is_verified
  isUrgentSale?: boolean;
  isFurnished?: boolean;
  hasParking?: boolean;
  isNewConstruction?: boolean;
  isReadyToMove?: boolean;
  furnishingType?: string;
  lot_size?: number;
  floor_number?: number;
  total_floors?: number;
  views_count?: number;
  favorites_count?: number;
  owner?: string;
}

// Export individual functions for direct import
export const saveProperty = async (propertyId: string, token: string) => {
  return propertiesService.saveProperty(propertyId, token);
};

export const unsaveProperty = async (propertyId: string, token: string) => {
  return propertiesService.unsaveProperty(propertyId, token);
};

export const fetchSavedProperties = async (token: string) => {
  return propertiesService.getSavedProperties(token);
};

export const propertiesService = {
  getProperties: async (params: PropertySearchParams) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ) as [string, string][],
    ).toString();
    console.log("queryString", queryString);
    const response = await api.get(`/property?${queryString}`);
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await api.get(`/property/${id}`);
    return response.data;
  },

  saveProperty: async (propertyId: string, token: string) => {
    const response = await api.post(
      `/user/me/saved-properties/${propertyId}`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  unsaveProperty: async (propertyId: string, token: string) => {
    const response = await api.delete(
      `/user/me/saved-properties/${propertyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  checkSavedProperty: async (propertyId: string, token: string) => {
    const response = await api.get(`/user/me/saved-properties/${propertyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getSavedProperties: async (token: string) => {
    const response = await api.get("/property/saved", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMyProperties: async (token: string) => {
    const response = await api.get("/property/my-properties", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  getPropertiesByIds: async (ids: string[]) => {
    const response = await api.post("/property/batch", { ids });
    return response.data;
  },

  createProperty: async (data: FormData) => {
    const response = await api.post("/property", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProperty: async (id: string, data: FormData) => {
    const response = await api.patch(`/property/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  saveDraft: async (data: FormData) => {
    const response = await api.post("/property/draft", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/property/${id}`);
    return response.data;
  },
};
