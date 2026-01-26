import { ListingFormData } from "./schemas/property";
import {
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  CITIES,
  NEIGHBORHOODS,
  CONSTRUCTION_STATUSES,
  PROPERTY_CONDITIONS,
  FACING_DIRECTIONS,
  FURNISHING_TYPES,
  AMENITIES,
} from "@/lib/constants";

export function generateMockListingFormData(): ListingFormData {
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min: number, max: number) =>
    parseFloat((Math.random() * (max - min) + min).toFixed(4));

  // Extract values from constants for random selection
  const propertyTypes = PROPERTY_TYPES.map((t) => t.value);
  const transactionTypes = TRANSACTION_TYPES.map((t) => t.value);
  const cities = CITIES.map((c) => c.value);
  const neighborhoods = NEIGHBORHOODS.map((n) => n.value);
  const constructionStatuses = CONSTRUCTION_STATUSES.map((s) => s.value);
  const propertyConditions = PROPERTY_CONDITIONS.map((c) => c.value);

  const selectedPropertyType =
    propertyTypes[randomInt(0, propertyTypes.length - 1)];
  const isResidential =
    selectedPropertyType === "Flat" ||
    selectedPropertyType === "House" ||
    selectedPropertyType === "Mess";

  return {
    property_type: selectedPropertyType,
    transaction_type:
      transactionTypes[randomInt(0, transactionTypes.length - 1)],
    location: {
      address: `Mock Address ${randomInt(1, 100)}, ${neighborhoods[randomInt(0, neighborhoods.length - 1)]}`,
      city: cities[randomInt(0, cities.length - 1)],
      neighborhood: neighborhoods[randomInt(0, neighborhoods.length - 1)],
      zip_code: `12${randomInt(10, 99)}`,
      coordinates: {
        latitude: randomFloat(23.7, 24.9),
        longitude: randomFloat(88.0, 92.0),
      },
    },
    price: randomInt(5000, 50000000),
    size: `${randomInt(500, 5000)} sq ft`,
    title: `Beautiful ${selectedPropertyType} in ${cities[randomInt(0, cities.length - 1)]}`,
    description: `This is a mock description for a ${selectedPropertyType}. It is spacious, well-located, and perfect for ${isResidential ? "families" : "investment"}.`,
    bedrooms: isResidential ? randomInt(1, 5) : undefined,
    bathrooms: isResidential ? randomInt(1, 4) : undefined,
    images: [],
    contact: {
      phone: `+8801${randomInt(100000000, 999999999)}`,
      email: `test${randomInt(1, 100)}@example.com`,
      whatsapp: `+8801${randomInt(100000000, 999999999)}`,
    },
    // posted_date removed as it's not part of the schema
    legal_verification: {
      status: "Pending",
      details: "Mock legal details for testing.",
    },
    installment: {
      available: Math.random() > 0.5,
      duration_months: randomInt(12, 60),
      down_payment_percentage: randomInt(10, 50),
      monthly_amount: randomInt(20000, 100000),
      service_details:
        "Flexible installment plans available with competitive interest rates. Processing fee applies.",
      terms_and_conditions:
        "Early payment discounts available. Late payment penalties apply. Subject to credit approval.",
    },
    amenities: isResidential ? ["Parking", "Lift", "Security"] : [],
    eco_features: ["Solar Panels", "Rainwater Harvesting"],
    smart_features: isResidential ? ["Smart Locks", "Smart Thermostat"] : [],
    is_featured: Math.random() > 0.5,
    is_verified: Math.random() > 0.5,
    status: "draft",
    holding_number: `DHK-GUL-${randomInt(1000, 9999)}`,
    construction_status: isResidential
      ? constructionStatuses[randomInt(0, constructionStatuses.length - 1)]
      : undefined,
    year_built: isResidential ? randomInt(2000, 2024) : undefined,
    facing_direction: isResidential
      ? Math.random() > 0.5
        ? "North"
        : "South"
      : undefined,
    property_condition: isResidential
      ? propertyConditions[randomInt(0, propertyConditions.length - 1)]
      : undefined,
    nearby_places: [
      {
        type: "Hospital",
        name: "Mock Hospital",
        distance: `${randomFloat(0.5, 10).toFixed(1)} km`,
      },
      {
        type: "School",
        name: "Mock School",
        distance: `${randomFloat(0.5, 10).toFixed(1)} km`,
      },
      {
        type: "Market",
        name: "Mock Market",
        distance: `${randomFloat(0.5, 10).toFixed(1)} km`,
      },
      {
        type: "Transport",
        name: "Mock Bus Stop",
        distance: `${randomFloat(0.1, 5).toFixed(1)} km`,
      },
      {
        type: "Other",
        name: "Mock Restaurant",
        distance: `${randomFloat(0.1, 5).toFixed(1)} km`,
      },
    ],
  };
}
