"use client";

import {
  setActiveCourseId,
  setCourses,
  setError,
  setLoading,
} from "@/redux/slices/courseSlice";
import { setCourseFeedback } from "@/redux/slices/studentSlice";
import { AppDispatch } from "@/redux/store";
import { backendDomain } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useCourseHandlers() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/get_all_courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch the courses");
        }
        const data = await response.json();
        dispatch(setCourses(data));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleViewCourse = (id: number) => {
    dispatch(setLoading(true));
    try {
      dispatch(setActiveCourseId(id));
      router.push(`/courses/${id}`);
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePostFeedback = async (id: number, email: string | undefined) => {
    dispatch(setLoading(true));
    try {
      dispatch(setActiveCourseId(id));
      const response = await fetch(
        `${backendDomain}/user_course_feedback/${id}/${email}/`,
        {
          method: "GET",
        }
      );
      if (response.status === 404) {
        router.push(`/courses/${id}/feedback`);
      } else {
        const data = await response.json();
        dispatch(setCourseFeedback(data));
        router.push(`/courses/${id}/feedback/show`);
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleViewCourse, handlePostFeedback };
}
