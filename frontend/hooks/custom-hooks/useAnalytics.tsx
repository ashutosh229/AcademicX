import { AnalyticsData, AnalyticsResult, backendDomain } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useAnalytics(): AnalyticsResult {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef<boolean>(true);
  // Track if a request is in progress
  const isRequestPending = useRef<boolean>(false);
  // Cache data timestamp to avoid redundant fetches
  const lastFetchTime = useRef<number>(0);
  // Cache time - 5 minutes
  const CACHE_DURATION = 300000;

  const fetchAnalytics = useCallback(
    async (force: boolean = false): Promise<void> => {
      // Skip if a request is already in progress
      if (isRequestPending.current) return;

      // Use cached data if available and not forced refresh
      const now = Date.now();
      if (!force && analytics && now - lastFetchTime.current < CACHE_DURATION) {
        return;
      }

      isRequestPending.current = true;
      setLoading(true);
      setError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${backendDomain}/get_analytics/`, {
          signal: controller.signal,
          cache: "default",
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();

        if (isMounted.current) {
          setAnalytics(data);
          lastFetchTime.current = now;
        }
      } catch (err: any) {
        if (isMounted.current) {
          const errorMessage =
            err.name === "AbortError"
              ? "Request timed out"
              : err.message || "An error occurred";

          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
        isRequestPending.current = false;
      }
    },
    [analytics]
  );

  // Initial data fetch
  useEffect(() => {
    fetchAnalytics();

    return () => {
      isMounted.current = false;
    };
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: () => fetchAnalytics(true),
  };
}
