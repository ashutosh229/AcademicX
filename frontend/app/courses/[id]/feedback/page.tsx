import { courses } from "@/lib/types";
import FeedbackForm from "./feedback-form";

// This function tells Next.js which paths to pre-render
export function generateStaticParams() {
  return courses.map((course) => ({
    id: course.course_id,
  }));
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.course_id === params.id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return <FeedbackForm course={course} />;
}
