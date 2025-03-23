import { courses } from "@/lib/data";
import CoursePageClient from "./client";

// This function tells Next.js which paths to pre-render
export function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

export default function CoursePage({ params }: { params: { id: number } }) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return <CoursePageClient course={course} />;
}
