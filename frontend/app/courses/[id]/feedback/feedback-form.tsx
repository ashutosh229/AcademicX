"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FeedbackFormProps {
  course: Course;
}

export default function FeedbackForm({ course }: FeedbackFormProps) {
  const router = useRouter();
  const [contentToughness, setContentToughness] = useState([5]);
  const [workload, setWorkload] = useState([5]);
  const [recommend, setRecommend] = useState(true);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - replace with actual API call when backend is implemented
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/courses/${course.course_id}`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Feedback</h1>
          <p className="text-xl text-gray-600 mb-1">{course.name}</p>
          <p className="text-gray-500">
            {course.code} • {course.professor}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Content Toughness */}
          <div className="space-y-4">
            <Label>
              Content Toughness
              <span className="text-sm text-gray-500 ml-2">
                ({contentToughness[0]}/10)
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Easy</span>
              <Slider
                value={contentToughness}
                onValueChange={setContentToughness}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Hard</span>
            </div>
          </div>

          {/* Workload */}
          <div className="space-y-4">
            <Label>
              Workload
              <span className="text-sm text-gray-500 ml-2">
                ({workload[0]}/10)
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Light</span>
              <Slider
                value={workload}
                onValueChange={setWorkload}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">Heavy</span>
            </div>
          </div>

          {/* Overall Recommendation */}
          <div className="space-y-4">
            <Label>Would you recommend this course?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={recommend ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRecommend(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Recommend
              </Button>
              <Button
                type="button"
                variant={!recommend ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRecommend(false)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Don't Recommend
              </Button>
            </div>
          </div>

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
}
