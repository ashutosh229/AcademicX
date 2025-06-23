"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getCourseNameFromId } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ShowFeedback = () => {
  const { data: session } = useSession();
  const { courseFeedback } = useSelector((state: RootState) => state.student);
  const { activeCourseId, courses } = useSelector(
    (state: RootState) => state.course
  );
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteAndGiveNewFeedback = async () => {
    const response = await fetch(`${backendDomain}/delete_course_feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        email: session?.user.email?.toString(),
        course_id: activeCourseId,
      }),
    });
    if (!response.ok) {
      throw new Error("Unable to delete the course feedback");
    }
    toast({
      title: "Success",
      description: "Successfully deleted the course feedback",
    });
    router.push(`/courses/${activeCourseId}/feedback`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Course Feedback</CardTitle>
          <p className="text-sm text-gray-500">
            Course Name: {getCourseNameFromId(courses, courseFeedback?.course)}
          </p>
          <p className="text-sm text-gray-500">Contributed by: You</p>
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

      {/* Delete and Give New Feedback Button */}
      <Button
        className="mt-6 bg-red-600 hover:bg-red-700"
        onClick={handleDeleteAndGiveNewFeedback}
      >
        Delete and Give New Feedback
      </Button>
    </div>
  );
};

export default ShowFeedback;
