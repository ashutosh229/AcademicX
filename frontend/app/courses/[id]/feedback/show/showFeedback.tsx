"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const ShowFeedback = () => {
  const { courseFeedback } = useSelector((state: RootState) => state.student);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Course Feedback</CardTitle>
          <p className="text-sm text-gray-500">
            Course ID: {courseFeedback?.course}
          </p>
          <p className="text-sm text-gray-500">
            Contributor: {courseFeedback?.contributor}
          </p>
        </CardHeader>
        <CardContent>
          {[
            {
              label: "Content Toughness",
              value: courseFeedback?.content_toughness,
            },
            {
              label: "Teaching Quality",
              value: courseFeedback?.teaching_quality,
            },
            { label: "Workload", value: courseFeedback?.workload },
            {
              label: "Exam Difficulty",
              value: courseFeedback?.exam_difficulty,
            },
            {
              label: "Grading Strictness",
              value: courseFeedback?.grading_strictness,
            },
            {
              label: "Resources Provided",
              value: courseFeedback?.resources_provided,
            },
            { label: "Recommendation", value: courseFeedback?.recommendation },
            { label: "Grade Obtained", value: courseFeedback?.grade_obtained },
          ].map((item, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm font-medium">
                {item.label} ({item.value ?? 0}/10)
              </p>
              <Progress value={((item.value ?? 0) / 10) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowFeedback;
