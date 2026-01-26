import useSWR, { SWRConfiguration } from 'swr';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/api/axios';

type FetcherOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

const fetcher = async ({ url, method = 'GET', body, headers }: FetcherOptions) => {
  try {
    const response = await apiClient({
      url,
      method,
      data: body,
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export function useDataFetch<T = any>(options: FetcherOptions, swrOptions?: SWRConfiguration) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  // Only fetch if authenticated (when needed)
  const { data, error, mutate, isLoading, isValidating } = useSWR<T>(
    isAuthenticated ? [options.url, options.method, options.body] : null,
    () => fetcher(options),
    {
      revalidateOnFocus: false, // Don't revalidate when window gets focus
      revalidateIfStale: true, // Revalidate if data is stale
      revalidateOnReconnect: true, // Revalidate when browser regains connection
      shouldRetryOnError: true, // Retry on error
      errorRetryCount: 3, // Retry 3 times on error
      errorRetryInterval: 5000, // Wait 5 seconds between retries
      dedupingInterval: 2000, // Deduplicate requests within 2 seconds
      focusThrottleInterval: 5000, // Throttle focus events to 5 seconds
      loadingTimeout: 3000, // Show loading state after 3 seconds
      ...swrOptions,
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}