'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setSessionUpdateCallback } from '@/utils/refresh-token';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();

  useEffect(() => {
    // Set up the session update callback
    const updateSessionCallback = async (newToken: string, newRefreshToken?: string) => {
      try {
        await update({
          ...session,
          user: {
            ...session?.user,
            token: newToken,
            refreshToken: newRefreshToken || session?.user?.refreshToken,
          },
        });
        console.log('Session updated with new tokens');
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    };

    setSessionUpdateCallback(updateSessionCallback);

    // Cleanup on unmount
    return () => {
      setSessionUpdateCallback(null);
    };
  }, [session, update]);

  return <>{children}</>;
}