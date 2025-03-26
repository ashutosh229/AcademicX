"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const backendURL = "http://localhost:8080"; // Replace with your actual backend URL

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<Record<string, number> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${backendURL}/get_analytics/`);
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

  const analyticsData = [
    { label: "Activated Users", key: "number_of_users_activated" },
    { label: "Total Comments", key: "number_of_comments" },
    { label: "Total Feedbacks", key: "number_of_feedbacks" },
    { label: "Courses Rated", key: "number_of_courses_rated" },
    {
      label: "Unique Users Gave Feedback",
      key: "number_of_unique_users_gave_feedback",
    },
    { label: "Total Resources", key: "number_of_resources" },
    { label: "Total Upvotes", key: "number_of_upvotes" },
    { label: "Total Downvotes", key: "number_of_downvotes" },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.map((item) => (
            <Skeleton key={item.key} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.map((item) => (
            <Card key={item.key} className="shadow-lg">
              <CardHeader>
                <CardTitle>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {analytics ? analytics[item.key] : "N/A"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
