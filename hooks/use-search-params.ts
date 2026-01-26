// hooks/use-search-params.ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchParamsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams object by merging the current and new params
  const createQueryString = useCallback(
    (name: string, value: string | number | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '' || value === false) {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateSearchParams = useCallback(
    (name: string, value: string | number | boolean | null) => {
      const queryString = createQueryString(name, value);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router]
  );

  const getParam = useCallback(
    (name: string) => searchParams.get(name),
    [searchParams]
  );

  const getAllParams = useCallback(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  return { updateSearchParams, getParam, getAllParams };
}
