"use client";

import { setActiveCourseId } from "@/redux/slices/courseSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import FeedbackForm from "./feedback-form";

// // This function tells Next.js which paths to pre-render
// export function generateStaticParams() {
//   return courses.map((course) => ({
//     id: course.course_id,
//   }));
// }

export default function FeedbackPage({ params }: { params: { id: number } }) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      dispatch(setActiveCourseId(params.id));
    } else {
      router.push("/courses");
    }
  }, [params.id, dispatch, router]);

  return <FeedbackForm />;
}
