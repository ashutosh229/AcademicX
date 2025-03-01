import { courses } from "@/lib/data";
import FeedbackForm from "./feedback-form";

export function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return <FeedbackForm course={course} />;
}
