import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/api/axios';
import { useCallback, useMemo } from 'react';

type FetcherOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

type OptimizedFetchOptions<T> = {
  queryKey: (string | number | boolean | object)[];
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
} & Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

type OptimizedMutationOptions<T, V> = {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: any, variables: V) => void;
  invalidateQueries?: string[][];
} & Omit<UseMutationOptions<T, any, V>, 'mutationFn'>;

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

// Optimized query hook with React Query
export function useOptimizedQuery<T = any>(
  options: FetcherOptions,
  queryOptions?: OptimizedFetchOptions<T>
) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const queryKey = useMemo(() => {
    return queryOptions?.queryKey || [options.url, options.method, options.body];
  }, [options.url, options.method, options.body, queryOptions?.queryKey]);

  const queryFn = useCallback(() => fetcher(options), [options]);

  return useQuery({
    queryKey,
    queryFn,
    enabled: queryOptions?.enabled !== false && (isAuthenticated || !options.url.includes('/auth')),
    staleTime: queryOptions?.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: queryOptions?.cacheTime || 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: queryOptions?.refetchOnWindowFocus || false,
    refetchOnReconnect: queryOptions?.refetchOnReconnect || true,
    retry: queryOptions?.retry || 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...queryOptions,
  });
}

// Optimized mutation hook with automatic cache invalidation
export function useOptimizedMutation<T = any, V = any>(
  options: FetcherOptions,
  mutationOptions?: OptimizedMutationOptions<T, V>
) {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(
    (variables: V) => {
      const requestOptions = {
        ...options,
        body: variables || options.body,
      };
      return fetcher(requestOptions);
    },
    [options]
  );

  return useMutation({
    mutationFn,
    onSuccess: (data: T, variables: V) => {
      // Invalidate related queries
      if (mutationOptions?.invalidateQueries) {
        mutationOptions.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom onSuccess
      mutationOptions?.onSuccess?.(data, variables);
    },
    onError: mutationOptions?.onError,
    ...mutationOptions,
  });
}

// Prefetch utility for better UX
export function usePrefetch() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const prefetchQuery = useCallback(
    async (options: FetcherOptions, queryKey?: (string | number | boolean | object)[]) => {
      if (!isAuthenticated && options.url.includes('/auth')) return;

      const key = queryKey || [options.url, options.method, options.body];
      
      await queryClient.prefetchQuery({
        queryKey: key,
        queryFn: () => fetcher(options),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },
    [queryClient, isAuthenticated]
  );

  return { prefetchQuery };
}

// Cache management utilities
export function useCacheManager() {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (queryKey: (string | number | boolean | object)[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  const removeQueries = useCallback(
    (queryKey: (string | number | boolean | object)[]) => {
      queryClient.removeQueries({ queryKey });
    },
    [queryClient]
  );

  const setQueryData = useCallback(
    <T>(queryKey: (string | number | boolean | object)[], data: T) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient]
  );

  const getQueryData = useCallback(
    <T>(queryKey: (string | number | boolean | object)[]): T | undefined => {
      return queryClient.getQueryData(queryKey);
    },
    [queryClient]
  );

  return {
    invalidateQueries,
    removeQueries,
    setQueryData,
    getQueryData,
  };
}

// Optimistic updates utility
export function useOptimisticUpdate<T>() {
  const queryClient = useQueryClient();

  const updateOptimistically = useCallback(
    async (
      queryKey: (string | number | boolean | object)[],
      updateFn: (oldData: T | undefined) => T,
      mutationPromise: Promise<T>
    ) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T>(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, updateFn(previousData));

      try {
        const result = await mutationPromise;
        // Update with server response
        queryClient.setQueryData(queryKey, result);
        return result;
      } catch (error) {
        // Rollback on error
        queryClient.setQueryData(queryKey, previousData);
        throw error;
      }
    },
    [queryClient]
  );

  return { updateOptimistically };
}