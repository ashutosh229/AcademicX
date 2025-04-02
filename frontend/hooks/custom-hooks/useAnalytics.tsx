import { backendDomain } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Record<string, number> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${backendDomain}/get_analytics/`);
        if (!response.ok) throw new Error("Failed to fetch analytics data");

        const data = await response.json();
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, loading, error };
}
