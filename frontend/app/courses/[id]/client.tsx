"use client";

import { type Course } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  ExternalLink,
} from "lucide-react";
import GaugeChart from "react-gauge-chart"; // Add this library
import { Bar } from "react-chartjs-2"; // Bar chart library
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CoursePageClientProps {
  course: Course;
}

export default function CoursePageClient({ course }: CoursePageClientProps) {
  const recommendationPercentage =
    (course.metrics.overallRecommendation.recommended /
      (course.metrics.overallRecommendation.recommended +
        course.metrics.overallRecommendation.notRecommended)) *
    100;

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const contentToughnessData = {
    labels: ["Content Toughness"],
    datasets: [
      {
        label: "Average",
        data: [course.metrics.contentToughness.average],
        backgroundColor: "#29AB87",
      },
    ],
  };

  const workloadData = {
    labels: ["Workload"],
    datasets: [
      {
        label: "Average",
        data: [course.metrics.workload.average],
        backgroundColor: "#00C9FF",
      },
    ],
  };

  const recommendationData = {
    labels: ["Recommended", "Not Recommended"],
    datasets: [
      {
        label: "Count",
        data: [
          course.metrics.overallRecommendation.recommended,
          course.metrics.overallRecommendation.notRecommended,
        ],
        backgroundColor: ["#29AB87", "#FF5F6D"],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {course.name}{" "}
          <span className="text-2xl text-gray-600">({course.code})</span>
        </h1>
        <p className="text-xl text-gray-600">Professor: {course.professor}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Metrics Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Course Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Content Toughness */}
              <div>
                <h3 className="text-lg font-medium mb-4">Content Toughness</h3>
                <GaugeChart
                  id="content-toughness-gauge"
                  nrOfLevels={10}
                  arcsLength={[0.2, 0.4, 0.4]}
                  colors={["#FF5F6D", "#FFC371", "#29AB87"]}
                  percent={course.metrics.contentToughness.average / 10}
                  textColor="#000"
                />
                <p className="text-center mt-2">
                  Average: {course.metrics.contentToughness.average}/10
                </p>
                <Bar
                  data={contentToughnessData}
                  options={barOptions}
                  className="mt-4"
                />
              </div>

              {/* Workload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Workload</h3>
                <GaugeChart
                  id="workload-gauge"
                  nrOfLevels={10}
                  arcsLength={[0.3, 0.4, 0.3]}
                  colors={["#00C9FF", "#FFD700", "#FF4500"]}
                  percent={course.metrics.workload.average / 10}
                  textColor="#000"
                />
                <p className="text-center mt-2">
                  Average: {course.metrics.workload.average}/10
                </p>
                <Bar
                  data={workloadData}
                  options={barOptions}
                  className="mt-4"
                />
              </div>
            </div>

            {/* Overall Recommendation */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium mb-4">
                Overall Recommendation
              </h3>
              <GaugeChart
                id="recommendation-gauge"
                nrOfLevels={10}
                arcsLength={[0.7, 0.3]}
                colors={["#29AB87", "#FF5F6D"]}
                percent={recommendationPercentage / 100}
                textColor="#000"
              />
              <p className="text-center mt-2">
                Recommendation Rate: {recommendationPercentage.toFixed(1)}%
              </p>
              <div className="flex justify-center items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>
                    {course.metrics.overallRecommendation.recommended} Ticks
                  </span>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-6 h-6" />
                  <span>
                    {course.metrics.overallRecommendation.notRecommended}{" "}
                    Crosses
                  </span>
                </div>
              </div>
              <Bar
                data={recommendationData}
                options={barOptions}
                className="mt-4"
              />
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Comments</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>

            <div className="space-y-6">
              {course.comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium">
                      {comment.author.isAnonymous
                        ? "Anonymous"
                        : comment.author.name}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-sm text-gray-600">
                        <ArrowUpCircle className="h-4 w-4 mr-1" />
                        {comment.upvotes}
                      </button>
                      <button className="flex items-center text-sm text-gray-600">
                        <ArrowDownCircle className="h-4 w-4 mr-1" />
                        {comment.downvotes}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Posted on{" "}
                    {new Date(comment.datePosted).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Resources Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Resources</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            <div className="space-y-4">
              {course.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {resource.name}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                      <p className="text-sm text-gray-600">
                        {resource.type} • By{" "}
                        {resource.contributor.isAnonymous
                          ? "Anonymous"
                          : resource.contributor.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="flex items-center text-sm text-gray-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {resource.upvotes}
                    </button>
                    <button className="flex items-center text-sm text-gray-600">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {resource.downvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
