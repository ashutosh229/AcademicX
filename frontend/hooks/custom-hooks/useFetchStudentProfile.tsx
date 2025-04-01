"use client";

import {
  setActiveStudent,
  setError,
  setLoading,
} from "@/redux/slices/studentSlice";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function useFetchStudentProfile() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const prevEmailRef = useRef(null);

  const fetchStudents = useCallback(
    async (email: any) => {
      if (!email) return;

      // Skip if email hasn't changed
      if (prevEmailRef.current === email) return;
      prevEmailRef.current = email;

      dispatch(setLoading(true));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(
          `${backendDomain}/get_student_profile/${email}/`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Unable to fetch the students");
        }

        const data = await response.json();
        dispatch(setActiveStudent(data));
        // Only show success toast on initial load, not on refreshes
        if (!prevEmailRef.current) {
          toast.success("Students fetched successfully");
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error("Request timeout");
          dispatch(setError("Request timed out"));
          toast.error("Request timed out");
        } else {
          console.error("Fetch error:", error);
          dispatch(setError(error.message || "Failed to fetch student data"));
          toast.error(error.message || "Failed to fetch student data");
        }
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchStudents(session?.user?.email);
  }, [session?.user?.email, fetchStudents]);
}
