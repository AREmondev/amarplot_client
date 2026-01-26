import { ListingFormData } from "@/lib/schemas/property";
import { BasicInformationStep } from "@/components/property/add-property-steps/BasicInformationStep";
import { LocationDetailsStep } from "@/components/property/add-property-steps/LocationDetailsStep";
import { PropertyDetailsStep } from "@/components/property/add-property-steps/PropertyDetailsStep";
import { FeaturesAmenitiesStep } from "@/components/property/add-property-steps/FeaturesAmenitiesStep";
import { ContactInformationStep } from "@/components/property/add-property-steps/ContactInformationStep";
import { MediaUploadsStep } from "@/components/property/add-property-steps/MediaUploadsStep";
import { LegalFinancialsStep } from "@/components/property/add-property-steps/LegalFinancialsStep";
import { ReviewPublishStep } from "@/components/property/add-property-steps/ReviewPublishStep";

interface Step {
  id: string;
  title: string;
  fields: (keyof ListingFormData | `location.${string}` | `contact.${string}` | `legal_verification.${string}` | `installment.${string}`)[];
  summary: (data: ListingFormData) => string;
  component: React.ComponentType<any>;
}

export const propertySteps: Step[] = [
  {
    id: "basic-info",
    title: "Basic Information",
    fields: ["title", "property_type", "transaction_type", "price", "size", "description"],
    summary: (data) => {
      const parts = [];
      if (data.title) parts.push(data.title);
      if (data.property_type) parts.push(data.property_type);
      if (data.price) parts.push(`$${data.price}`);
      return parts.join(" - ") || "Not filled";
    },
    component: BasicInformationStep,
  },
  {
    id: "location",
    title: "Location Details",
    fields: ["location.address", "location.city", "location.neighborhood", "location.zip_code", "location.coordinates"],
    summary: (data) => {
      const parts = [];
      if (data.location?.address) parts.push(data.location.address);
      if (data.location?.city) parts.push(data.location.city);
      return parts.join(", ") || "Not filled";
    },
    component: LocationDetailsStep,
  },
  {
    id: "property-details",
    title: "Property Details",
    fields: ["bedrooms", "bathrooms", "unit_number", "holding_number", "construction_status", "year_built", "facing_direction", "property_condition"],
    summary: (data) => {
      const parts = [];
      if (data.bedrooms) parts.push(`${data.bedrooms} Beds`);
      if (data.bathrooms) parts.push(`${data.bathrooms} Baths`);
      if (data.year_built) parts.push(`Built ${data.year_built}`);
      return parts.join(", ") || "Not filled";
    },
    component: PropertyDetailsStep,
  },
  {
    id: "features-amenities",
    title: "Features & Amenities",
    fields: ["amenities", "eco_features", "smart_features", "nearby_places"],
    summary: (data) => {
      const parts = [];
      if (data.amenities?.length) parts.push(`${data.amenities.length} Amenities`);
      if (data.eco_features?.length) parts.push(`${data.eco_features.length} Eco Features`);
      return parts.join(", ") || "Not filled";
    },
    component: FeaturesAmenitiesStep,
  },
  {
    id: "contact-info",
    title: "Contact Information",
    fields: ["contact.phone", "contact.email", "contact.whatsapp"],
    summary: (data) => {
      const parts = [];
      if (data.contact?.phone) parts.push(data.contact.phone);
      if (data.contact?.email) parts.push(data.contact.email);
      return parts.join(" / ") || "Not filled";
    },
    component: ContactInformationStep,
  },
  {
    id: "legal-financials",
    title: "Legal & Financials",
    fields: ["legal_verification.status", "legal_verification.details", "installment.available", "installment.duration_months", "installment.down_payment_percentage", "installment.monthly_amount", "installment.service_details", "installment.terms_and_conditions"],
    summary: (data) => {
      const parts = [];
      if (data.legal_verification?.status) parts.push(`Status: ${data.legal_verification.status}`);
      if (data.installment?.available) parts.push("Installment Available");
      return parts.join(", ") || "Not filled";
    },
    component: LegalFinancialsStep,
  },
  {
    id: "media-uploads",
    title: "Media Uploads",
    fields: ["images", "imageFiles"],
    summary: (data) => {
      if (data.images?.length) return `${data.images.length} Images uploaded`;
      return "No images";
    },
    component: MediaUploadsStep,
  },
  {
    id: "review-publish",
    title: "Review & Publish",
    fields: [],
    summary: (data) => "Final review before publishing",
    component: ReviewPublishStep,
  },
];
