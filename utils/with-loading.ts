/**
 * A custom hook that creates a wrapped version of an async function with loading state.
 * It shows the loading screen before the function executes and hides it after completion.
 * 
 * @param asyncFn The async function to execute
 * @param loadingMessage Optional loading message to display
 * @returns A function that executes the original async function with loading state
 */
import { useCallback } from 'react';
import { useGlobalLoading } from '@/hooks/use-global-loading';

export function useLoadingFn<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  loadingMessage?: string
) {
  const { showLoading, hideLoading } = useGlobalLoading();
  
  return useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      try {
        showLoading(loadingMessage);
        return await asyncFn(...args);
      } finally {
        hideLoading();
      }
    },
    [asyncFn, loadingMessage, showLoading, hideLoading]
  );
}

/**
 * Example usage:
 * 
 * function MyComponent() {
 *   const fetchDataWithLoading = useLoadingFn(
 *     async () => {
 *       const response = await fetch('/api/data');
 *       return response.json();
 *     },
 *     'Fetching data...'
 *   );
 * 
 *   const handleClick = async () => {
 *     const data = await fetchDataWithLoading();
 *     // Use data...
 *   };
 *
 *   return <button onClick={handleClick}>Fetch Data</button>;
 * }
 */