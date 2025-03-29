"use client";
import { setActiveCourseId } from "@/redux/slices/courseSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CoursePageClient from "./client";

export default function CoursePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams(); // ✅ Correct way to access dynamic params

  useEffect(() => {
    if (params?.id) {
      dispatch(setActiveCourseId(Number(params.id))); // Ensure it's a number
    } else {
      router.push("/courses");
    }
  }, [params, dispatch, router]);

  return <CoursePageClient />;
}
