import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions {
  immediate?: boolean;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic fetch hook for data fetching
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = { immediate: true },
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [options.immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFetch;
