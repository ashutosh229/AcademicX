"use client";

import {
  setActiveCourseId,
  setCourses,
  setError,
  setLoading,
} from "@/redux/slices/courseSlice";
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

  const handlePostFeedback = (id: number) => {
    dispatch(setLoading(true));
    try {
      dispatch(setActiveCourseId(id));
      router.push(`/courses/${id}/feedback`);
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleViewCourse, handlePostFeedback };
}
