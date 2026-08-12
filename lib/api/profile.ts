import { User } from "@/types";
import apiClient from "./axios";

export const profileService = {
  getProfile: async (token?: string): Promise<User> => {
    const res = await apiClient.get("/user/me");
    return res.data.data; // Assuming the API returns { data: UserObject }
  },

  updateProfile: async (
    token: string,
    updatedProfile: Partial<User> | FormData,
  ): Promise<User> => {
    const config = {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        ...(updatedProfile instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    };

    const res = await apiClient.put("/user/me", updatedProfile, config);
    return res.data.data; // Assuming the API returns { data: UserObject }
  },

  leaveCommunity: async (communityId: string): Promise<any> => {
    const res = await apiClient.delete(
      `/user/me/joined-communities/${communityId}`,
    );
    return res.data;
  },

  rejoinCommunity: async (communityId: string): Promise<any> => {
    const res = await apiClient.post(
      `/user/me/joined-communities/${communityId}`,
    );
    return res.data.data; // Assuming the API returns { data: CommunityObject }
  },

  removeSavedProperty: async (propertyId: string): Promise<any> => {
    const res = await apiClient.delete(
      `/user/me/saved-properties/${propertyId}`,
    );
    return res.data;
  },

  getPropertiesByIds: async (propertyIds: string[]): Promise<any[]> => {
    const res = await apiClient.post("/properties/by-ids", {
      ids: propertyIds,
    });
    return res.data.data; // Assuming the API returns { data: Property[] }
  },
};
