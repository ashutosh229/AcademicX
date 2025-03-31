"use client";

import { useSetActiveCourseId } from "@/hooks/custom-hooks/useSetActiveCourseId";
import CoursePageClient from "./client";

export default function CoursePage() {
  useSetActiveCourseId();

  return <CoursePageClient />;
}
