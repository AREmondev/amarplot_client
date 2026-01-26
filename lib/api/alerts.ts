// alertsService.ts
import api from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// alerts.queryKeys.ts

export const ALERTS_KEYS = {
  user: ["userPropertyAlerts"] as const,
};

export const alertsService = {
  userPropertyAlerts: async () => {
    const res = await api.get("/alerts"); // make sure this matches backend
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to fetch alerts");
    return res.data.data; // only return array of alerts
  },

  createAlert: async (data: any) => {
    const res = await api.post("/alerts", data);
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to create alert");
    return res.data.data; // return created alert
  },

  updateAlert: async (id: string, data: any) => {
    const res = await api.patch(`/alerts/${id}`, data);
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to update alert");
    return res.data.data;
  },

  deleteAlert: async (id: string) => {
    const res = await api.delete(`/alerts/${id}`);
    if (!res.data.success)
      throw new Error(res.data.message || "Failed to delete alert");
    return res.data.data;
  },
};

// useUserPropertyAlertsQuery.ts

export const useUserPropertyAlertsQuery = () => {
  return useQuery({
    queryKey: ALERTS_KEYS.user,
    queryFn: alertsService.userPropertyAlerts,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alert: any) => alertsService.createAlert(alert),

    onSuccess: (newAlert) => {
      // Instant UI update
      queryClient.setQueryData(ALERTS_KEYS.user, (old: any[] = []) => [
        newAlert,
        ...old,
      ]);

      // Optional: ensure backend truth
      queryClient.invalidateQueries({ queryKey: ALERTS_KEYS.user });
    },
  });
};
export const useUpdateAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, alert }: { id: string; alert: any }) =>
      alertsService.updateAlert(id, alert),

    onSuccess: (updatedAlert) => {
      // Update cache directly
      queryClient.setQueryData(ALERTS_KEYS.user, (old: any[] = []) =>
        old.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)),
      );

      queryClient.invalidateQueries({ queryKey: ALERTS_KEYS.user });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => alertsService.deleteAlert(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ALERTS_KEYS.user });

      const previousAlerts = queryClient.getQueryData<any[]>(ALERTS_KEYS.user);

      queryClient.setQueryData(ALERTS_KEYS.user, (old = []) =>
        old.filter((alert) => alert.id !== id),
      );

      return { previousAlerts };
    },

    onError: (_err, _id, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(ALERTS_KEYS.user, context.previousAlerts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ALERTS_KEYS.user });
    },
  });
};
