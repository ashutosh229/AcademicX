"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/custom-hooks/useAnalytics";

const AnalyticsPage = () => {
  const { analytics, loading, error } = useAnalytics();

  const analyticsData = [
    { label: "Activated Users", key: "number_of_users_activated" },
    { label: "Comments Written", key: "number_of_comments" },
    { label: "Feedbacks Given", key: "number_of_feedbacks" },
    { label: "Courses Rated", key: "number_of_courses_rated" },
    {
      label: "Unique Users Who Gave Feedback",
      key: "number_of_unique_users_gave_feedback",
    },
    { label: "Resources Posted", key: "number_of_resources" },
    { label: "Total Upvotes", key: "number_of_upvotes" },
    { label: "Total Downvotes", key: "number_of_downvotes" },
  ];

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        📊 Analytics Overview
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? analyticsData.map((item) => (
              <Skeleton key={item.key} className="h-24 w-full rounded-lg" />
            ))
          : analyticsData.map((item) => (
              <Card
                key={item.key}
                className="shadow-md hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-200"
              >
                <CardHeader className="bg-gray-100 rounded-t-xl p-4">
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex justify-center items-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics ? analytics[item.key] : "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
