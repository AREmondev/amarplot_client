import axios from "axios";
import apiClient from "./axios";

export interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  address: string;
  city: string;
  neighborhood: string;
  zip_code: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const fetchPredictions = async (
  input: string
): Promise<AutocompletePrediction[]> => {
  if (!input) {
    return [];
  }
  try {
    // const response = await axios.get(
    //   `http://localhost:3000/place/search?input=${input}`
    // );
    const response = await apiClient.get(`/place/search?input=${input}`);
    console.log("response", response);
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error(
        "Failed to fetch predictions:",
        response.data.error_message
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching place predictions:", error);
    return [];
  }
};

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceDetails | null> => {
  if (!placeId) return null;

  try {
    // NOTE: The user did not specify an endpoint for place details.
    // This is an assumed endpoint and may need to be changed.
    const response = await apiClient.get(`/place/details?place_id=${placeId}`);
    if (response.data.success) {
      const result = response.data.data;
      const addressComponents = result.address_components;
      const location = result.geometry.location;

      let address = result.formatted_address || "";
      let city = "";
      let neighborhood = "";
      let zip_code = "";

      for (const component of addressComponents) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (
          component.types.includes("sublocality") ||
          component.types.includes("sublocality_level_1")
        ) {
          neighborhood = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          zip_code = component.long_name;
        }
      }

      return {
        address: address,
        city: city,
        neighborhood: neighborhood,
        zip_code: zip_code,
        coordinates: {
          latitude: location.lat,
          longitude: location.lng,
        },
      };
    } else {
      console.error(
        "Failed to fetch place details:",
        response.data.error_message
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};
