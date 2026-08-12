import refreshToken from "@/utils/refresh-token";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import Router from "next/router";

// Create axios instance with optimized configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor: Attach token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.token) {
      config.headers["Authorization"] = `Bearer ${session.user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Refresh token or sign out
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401s that haven't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResult = await refreshToken();
        console.log("refreshResult", refreshResult);

        if (refreshResult?.accessToken) {
          originalRequest.headers["Authorization"] =
            `Bearer ${refreshResult.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, sign out and redirect
        console.error("Token refresh failed", refreshError);
        await signOut({ redirect: false }); // avoid NextAuth default redirect
        Router.push("/auth"); // manually go to login page
      }
    }

    // If already retried once and still 401 → force logout
    if (error.response?.status === 401 && originalRequest._retry) {
      await signOut({ redirect: false });
      Router.push("/auth");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
