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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export function useCourseHandlers() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const coursesLoadedRef = useRef(false);
  const pendingRequestsRef = useRef(new Map());
  const { data: session } = useSession();

  useEffect(() => {
    // Prevent redundant API calls if data is already loaded
    if (coursesLoadedRef.current) return;

    const fetchCourses = async () => {
      dispatch(setLoading(true));

      // Create an abort controller for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`${backendDomain}/get_all_courses/`, {
          signal: controller.signal,
          cache: "default", // Use browser's HTTP cache when possible
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch the courses");
        }

        const data = await response.json();
        dispatch(setCourses(data));
        coursesLoadedRef.current = true;
      } catch (error: any) {
        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out"
            : error.message || "Error loading courses";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleViewCourse = useCallback(
    (id: number) => {
      if (session?.user.role === "viewer") {
        router.push("/view-course-viewer");
        return;
      }
      // This operation is synchronous, no need for loading state
      dispatch(setActiveCourseId(id));
      router.push(`/courses/${id}`);
    },
    [dispatch, router, session]
  );

  const handlePostFeedback = useCallback(
    async (id: number) => {
      if (session?.user.role === "viewer") {
        router.push("/post-feedback-viewer");
        return;
      }
      // Prevent duplicate requests for the same course/email
      const email = session?.user.email?.toString();
      const requestKey = `${id}-${email}`;
      if (pendingRequestsRef.current.get(requestKey)) return;

      pendingRequestsRef.current.set(requestKey, true);
      dispatch(setLoading(true));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        if (!email) {
          throw new Error("User email is required");
        }

        dispatch(setActiveCourseId(id));

        const response = await fetch(
          `${backendDomain}/user_course_feedback/${id}/${email}/`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.status === 404) {
          router.push(`/courses/${id}/feedback`);
        } else if (response.ok) {
          const data = await response.json();
          dispatch(setCourseFeedback(data));
          router.push(`/courses/${id}/feedback/show`);
        } else {
          throw new Error(`Unexpected response: ${response.status}`);
        }
      } catch (error: any) {
        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out"
            : error.message || "Error processing feedback";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
        pendingRequestsRef.current.delete(requestKey);
      }
    },
    [dispatch, router, session]
  );

  return { handleViewCourse, handlePostFeedback };
}
