"use client";

import MetricSlider from "@/components/charts/metricSlider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const FeedbackForm = () => {
  const { data: session } = useSession();
  const { courses, loading, error, activeCourseId } = useSelector(
    (state: RootState) => state.course
  );
  const router = useRouter();
  const dispatch = useDispatch();

  console.log("Courses:", courses);
  console.log("Active Course ID:", activeCourseId);

  const activeCourse = courses.find((course) => course.id === activeCourseId);

  if (!activeCourse) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">Course Feedback</h1>
          <p className="text-xl text-gray-600 mb-4">Course not found.</p>
          <Button onClick={() => router.push("/courses")}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const [contentToughness, setContentToughness] = useState([5]);
  const [teachingQuality, setTeachingQuality] = useState([5]);
  const [workload, setWorkload] = useState([5]);
  const [examDifficulty, setExamDifficulty] = useState([5]);
  const [gradingStrictness, setGradingStrictness] = useState([5]);
  const [resourcesProvided, setResourcesProvided] = useState([5]);
  const [recommendation, setRecommendation] = useState([5]);
  const [gradeObtained, setGradeObtained] = useState([5]);

  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendDomain = "http://localhost:8080";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${backendDomain}/give_course_feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: activeCourseId,
          content_toughness: contentToughness,
          teaching_quality: teachingQuality,
          workload: workload,
          exam_difficulty: examDifficulty,
          grading_strictness: gradingStrictness,
          resources_provided: resourcesProvided,
          recommendation: recommendation,
          grade_obtained: gradeObtained,
          contributor: session?.user.email?.toString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Unable to send the course feedback");
        toast.error("Unable to send the course feedback");
      }
      toast.success("Course Feedback sent successfully");
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Feedback</h1>
          <p className="text-xl text-gray-600 mb-1">{activeCourse.name}</p>
          <p className="text-gray-500">
            {activeCourse.code} • {activeCourse.professor}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Metric Sliders */}
          <MetricSlider
            label="Content Toughness"
            value={contentToughness}
            setValue={setContentToughness}
            minLabel="Easy"
            maxLabel="Hard"
          />
          <MetricSlider
            label="Teaching Quality"
            value={teachingQuality}
            setValue={setTeachingQuality}
            minLabel="Poor"
            maxLabel="Excellent"
          />
          <MetricSlider
            label="Workload"
            value={workload}
            setValue={setWorkload}
            minLabel="Light"
            maxLabel="Heavy"
          />
          <MetricSlider
            label="Exam Difficulty"
            value={examDifficulty}
            setValue={setExamDifficulty}
            minLabel="Easy"
            maxLabel="Hard"
          />
          <MetricSlider
            label="Grading Strictness"
            value={gradingStrictness}
            setValue={setGradingStrictness}
            minLabel="Lenient"
            maxLabel="Strict"
          />
          <MetricSlider
            label="Resources Provided"
            value={resourcesProvided}
            setValue={setResourcesProvided}
            minLabel="Insufficient"
            maxLabel="Great"
          />
          <MetricSlider
            label="Recommendation"
            value={recommendation}
            setValue={setRecommendation}
            minLabel="Not Recommended"
            maxLabel="Highly Recommended"
          />
          <MetricSlider
            label="Grade Obtained"
            value={gradeObtained}
            setValue={setGradeObtained}
            minLabel="Low"
            maxLabel="High"
          />

          {/* Comment */}
          <div className="space-y-4">
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
              className="h-32"
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous" className="cursor-pointer">
              Submit Anonymously
            </Label>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
