import api from './axios';

export const userService = {
  getMe: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  updateMe: async (data) => {
    const response = await api.put('/user/me', data);
    return response.data;
  },
  addSavedProperty: async (userId, propertyId) => {
    const response = await api.post(`/user/${userId}/saved-properties/${propertyId}`);
    return response.data;
  },
  removeSavedProperty: async (userId, propertyId) => {
    const response = await api.delete(`/user/${userId}/saved-properties/${propertyId}`);
    return response.data;
  },
  addJoinedCommunity: async (userId, communityId) => {
    const response = await api.post(`/user/${userId}/joined-communities/${communityId}`);
    return response.data;
  },
  removeJoinedCommunity: async (userId, communityId) => {
    const response = await api.delete(`/user/${userId}/joined-communities/${communityId}`);
    return response.data;
  },
  savedProperty: async ({propertyId}: {propertyId: string}) => {
    const response = await api.post(`/user/me/saved-properties/${propertyId}`);
    return response.data;
  },
};
