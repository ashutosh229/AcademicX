"use client";

import GradeDropdown from "@/components/charts/dropDown";
import MetricSlider from "@/components/charts/metricSlider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FeedbackForm = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { courses, loading, error, activeCourseId } = useSelector(
    (state: RootState) => state.course
  );
  const router = useRouter();
  const dispatch = useDispatch();

  // console.log("Courses:", courses);

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
  const [gradeObtained, setGradeObtained] = useState<number>(-1);
  // const [comment, setComment] = useState("");
  // const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGradeAlert, setShowGradeAlert] = useState(false); // NEW

  const backendDomain = "http://localhost:8080";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gradeObtained === -1) {
      setShowGradeAlert(true);
      return;
    }
    setIsSubmitting(true);
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${backendDomain}/give_course_feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course: activeCourseId,
          content_toughness: contentToughness[0],
          teaching_quality: teachingQuality[0],
          workload: workload[0],
          exam_difficulty: examDifficulty[0],
          grading_strictness: gradingStrictness[0],
          resources_provided: resourcesProvided[0],
          recommendation: recommendation[0],
          grade_obtained: gradeObtained,
          contributor: session?.user.email?.toString(),
        }),
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Unable to send the course feedback");
      }
      dispatch(setLoading(false));
      setIsSubmitting(false);
      toast({
        title: "Success",
        description: "Course Feedback sent successfully",
      });
      router.push("/courses");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: "Unable to send the course feedback",
      });
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
          <GradeDropdown onChange={setGradeObtained}></GradeDropdown>

          {/* Comment */}
          {/* <div className="space-y-4">
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this course..."
              className="h-32"
            />
          </div> */}

          {/* Anonymous Toggle */}
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="anonymous" className="cursor-pointer">
              Submit Anonymously
            </Label>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div> */}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Card>

      <AlertDialog open={showGradeAlert} onOpenChange={setShowGradeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Missing Grade</AlertDialogTitle>
            <AlertDialogDescription>
              Please select the grade you obtained before submitting the
              feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowGradeAlert(false)}>
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeedbackForm;
