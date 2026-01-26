import { getSession, signIn } from "next-auth/react";
import { authService } from "@/lib/api/auth";

// Cache to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<
  { accessToken: string; refreshToken?: string } | undefined
> | null = null;

// Global session update callback - will be set by components that need session updates
let sessionUpdateCallback:
  | ((newToken: string, newRefreshToken?: string) => void)
  | null = null;

export const setSessionUpdateCallback = (
  callback: ((newToken: string, newRefreshToken?: string) => void) | null
) => {
  sessionUpdateCallback = callback;
};

const refreshToken = async () => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Create a new refresh promise
  refreshPromise = (async () => {
    try {
      const session = await getSession();

      if (!session?.user?.refreshToken || !session?.user?.id) {
        // Redirect to login if no refresh token is available
        signIn("credentials", { redirect: false });
        return undefined;
      }

      // Check if refresh token is expired (15 days)
      const refreshTokenExpires = (session as any).refreshTokenExpires;
      if (refreshTokenExpires && Date.now() > refreshTokenExpires) {
        console.warn("Refresh token expired, redirecting to login");
        signIn("credentials", { redirect: false });
        return undefined;
      }

      const response = await authService.refresh(
        session.user.id,
        session.user.refreshToken
      );
      // console.log("response refresh token", response);

      const newAccessToken = response.accessToken;
      const newRefreshToken = response.refreshToken;

      // Update session using callback if available
      console.log(
        "newAccessToken",
        newAccessToken,
        "newRefreshToken",
        newRefreshToken
      );
      sessionUpdateCallback(newAccessToken, newRefreshToken);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Redirect to login on refresh token failure
      signIn("credentials", { redirect: false });
      throw error; // Re-throw to propagate the error
    } finally {
      // Clear the promise cache after completion (success or failure)
      setTimeout(() => {
        refreshPromise = null;
      }, 1000); // Small delay to prevent race conditions
    }
  })();

  return refreshPromise;
};

export default refreshToken;
