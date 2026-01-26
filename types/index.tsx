export type Property = {
    _id: string,
  
    title: string
    type: "House" | "Land" | "Plot" | "Flat" | "Mess"
    price: string
    description: string
    location: {
      address: string
      lat: number
      lng: number
    }
    images: string[]
    status: "published" | "draft" | "pending"
    createdAt: string
    updatedAt: string
  }

  export type DraftData = {
    _id: string
    step: number
    data: Partial<Property>
    lastSaved: string
  }

  export type Listing = {
    listing_id: string;
    property_type: "Flat" | "House" | "Land" | "Plot" | "Mess";
    transaction_type: "Sell" | "Rent";
    location: {
      address: string;
      city: string;
      neighborhood: string;
      zip_code: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    price: number;
    size: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    unit_number?: string;
    holding_number?: string;
    images: string[];
    contact: {
      phone: string;
      email: string;
      whatsapp?: string;
    };
    posted_date: string;
    legal_verification: {
      status: "Verified" | "Pending" | "Rejected";
      details: string;
      verified_date?: string;
    };
    amenities: string[];
    floor_plan?: {
      url: string;
      format: string;
      description: string;
    };
    nearby_facilities: {
      type: "Hospital" | "School" | "Market" | "Transport" | "Other";
      name: string;
      distance: string;
    }[];
    construction_status: "Ready to Move" | "Under Construction" | "Upcoming";
    year_built?: number;
    video_tour?: {
      url: string;
      format: string;
      duration: string;
    };
    three_d_view?: {
      url: string;
      format: string;
      viewer?: string;
    };
    virtual_staging?: {
      room: string;
      url: string;
      description: string;
    }[];
    eco_features?: string[];
    smart_features?: string[];
    facing_direction?: string;
    property_condition?: "New" | "Used" | "Renovated";
    home_value_estimate?: {
      value: number;
      range: string;
      calculated_date: string;
      method: string;
    };
    neighborhood_insights?: {
      schools?: {
        count: number;
        details: string[];
      };
      hospitals?: {
        count: number;
        details: string[];
      };
      crime_rate?: "Low" | "Medium" | "High";
      transport?: string[];
      market_trends?: string;
    };
    mortgage_estimate?: {
      monthly_payment: number;
      down_payment: number;
      interest_rate: number;
      loan_term_years: number;
      lender_contacts?: {
        name: string;
        phone: string;
        website: string;
      }[];
    };
    is_featured?: boolean;
    is_verified?: boolean;
    analytics?: {
      views: number;
      inquiries: number;
      click_through_rate: string;
      last_updated: string;
    };
  };

  export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role?: "owner" | "user" | "agent";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isNIDVerified: boolean;
  stats: {
    listings: number;
    communities: number;
    posts: number;
    comments: number;
  };
  savedProperties: string[]; // Array of property IDs
  joinedCommunities: Community[]; // Array of community objects
  joinedAt: string;
};

export interface Community {
  _id: string;
  name: string;
  image?: string;
  members: number;
  role: string;
  joinedAt: string;
  isActive: boolean;
  category: string;
  posts: number;
  comments: number;
  likes: number;
  createdAt: string;
}

export interface Activity {
  _id: string;
  userId: string;
  type: string;
  description: string;
  relatedEntityId?: string;
  updatedAt: string;
}
  