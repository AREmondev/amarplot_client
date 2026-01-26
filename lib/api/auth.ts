import { LoginDto, RegisterDto } from "@/types/auth";
import { User } from "@/types";
import axios from "axios";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ,
});

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    console.log("credentials", credentials);
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    console.log("{response", response);
    return response.data.data;
  },
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  refresh: async (
    userId: string,
    refreshToken: string
  ): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh", {
      userId,
      refreshToken,
    });
    return response.data;
  },
};
