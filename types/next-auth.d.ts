import "next-auth";
import { User as DBUser } from "./index"; // Assuming your User type is exported from types/index.tsx

declare module "next-auth" {
  interface Session {
    user: DBUser & {
      id: string;
      role: string;
      token: string; // Access Token
      refreshToken: string; // Refresh Token
    };
  }

  interface JWT {
    id: string;
    role?: "owner" | "user" | "agent";
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number; // Timestamp when access token expires
    refreshTokenExpires: number; // Timestamp when refresh token expires
    user: DBUser; // Store the entire user object from the API
  }
}