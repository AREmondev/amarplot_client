import { z } from "zod";
import { PROPERTY_TYPE_VALUES, TRANSACTION_TYPE_VALUES } from "../constants";

// Nested Schemas
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const LocationSchema = z.object({
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  zip_code: z.string().min(1, "ZIP Code is required"),
  coordinates: CoordinatesSchema.optional(),
});

export const ContactSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().optional(),
});

export const LegalVerificationSchema = z.object({
  status: z.enum(["Verified", "Pending", "Rejected"]).default("Pending"),
  details: z.string().optional(),
});

export const InstallmentSchema = z.object({
  available: z.boolean().default(false),
  duration_months: z
    .number()
    .min(1, "Duration must be at least 1 month")
    .optional(),
  down_payment_percentage: z
    .number()
    .min(0)
    .max(100, "Down payment must be between 0-100%")
    .optional(),
  monthly_amount: z
    .number()
    .min(0, "Monthly amount must be positive")
    .optional(),
  service_details: z.string().optional(),
  terms_and_conditions: z.string().optional(),
});

export const NearbyPlaceSchema = z.object({
  name: z.string().min(1, "Place name is required"),
  type: z.enum(["Hospital", "School", "Market", "Transport", "Other"]),
  distance: z.string().min(1, "Distance is required"),
});

// Base Listing Schema (all fields optional for draft)
export const BaseListingSchema = z.object({
  listing_id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  location: LocationSchema.partial().optional(), // Make location fields optional for draft
  property_type: z
    .enum(["Flat", "House", "Land", "Plot", "Mess"] as const)
    .optional(),
  transaction_type: z.enum(["Sell", "Rent"] as const).optional(),
  size: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  unit_number: z.string().optional(),
  holding_number: z.string().optional(),
  construction_status: z.string().optional(),
  year_built: z.number().optional(),
  facing_direction: z.string().optional(),
  property_condition: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  eco_features: z.array(z.string()).optional(),
  smart_features: z.array(z.string()).optional(),
  nearby_places: z.array(NearbyPlaceSchema).optional(),
  installment: InstallmentSchema.partial().optional(), // Make installment fields optional for draft
  contact: ContactSchema.partial().optional(), // Make contact fields optional for draft
  legal_verification: LegalVerificationSchema.partial().optional(), // Make legal_verification fields optional for draft
  images: z.array(z.string()).optional(), // Storing URLs for now
  imageFiles: z.array(z.instanceof(File)).optional(), // For actual File objects during form submission
  status: z.enum(["published", "draft", "pending"]).default("draft"),
  is_featured: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

// Schema for Published Properties (enforces required fields)
export const PublishedListingSchema = BaseListingSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  location: LocationSchema.extend({
    address: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required"),
    neighborhood: z.string().optional(),
    zip_code: z.string().min(1, "ZIP Code is required"),
    coordinates: CoordinatesSchema.extend({
      latitude: z.number().min(-90).max(90, "Invalid latitude"),
      longitude: z.number().min(-180).max(180, "Invalid longitude"),
    }).optional(),
  }),
  property_type: z.enum(["Flat", "House", "Land", "Plot", "Mess"] as const, {
    required_error: "Property type is required",
    invalid_type_error:
      "Property type must be one of: Flat, House, Land, Plot, Mess",
  }),
  transaction_type: z.enum(["Sell", "Rent"] as const, {
    required_error: "Transaction type is required",
    invalid_type_error: "Transaction type must be one of: Sell, Rent",
  }),
  size: z.string().min(1, "Size is required"),
  contact: ContactSchema.extend({
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
  }),

  legal_verification: LegalVerificationSchema.extend({
    status: z.enum(["Verified", "Pending", "Rejected"], {
      required_error: "Legal verification status is required",
    }),
    details: z.string().min(1, "Legal details are required"),
  }),
  images: z.array(z.string()).min(1, "At least one image is required"),
  status: z.literal("published"),
});

export type ListingFormData = z.infer<typeof BaseListingSchema>;
export type PublishedListingFormData = z.infer<typeof PublishedListingSchema>;
