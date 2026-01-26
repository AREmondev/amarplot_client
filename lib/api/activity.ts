import api from './axios';

export const activityService = {
  getUserActivities: async (userId) => {
    const response = await api.get(`/activity/user/${userId}`);
    return response.data;
  },
};
