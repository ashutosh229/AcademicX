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
import { useToast } from "../use-toast";

export function useFetchStudentProfile() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const prevEmailRef = useRef(null);
  const { toast } = useToast();

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

        const response = await fetch(`${backendDomain}/get_student_profile/`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({ email: email }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Unable to fetch the students");
        }

        const data = await response.json();
        dispatch(setActiveStudent(data));
        // Only show success toast on initial load, not on refreshes
        if (!prevEmailRef.current) {
          toast({
            title: "Success",
            description: "Students fetched successfully",
          });
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.error("Request timeout");
          dispatch(setError("Request timed out"));
          toast({
            title: "Error",
            description: "Request timed out",
          });
        } else {
          console.error("Fetch error:", error);
          dispatch(setError(error.message || "Failed to fetch student data"));
          toast({
            title: "Error",
            description: error.message || "Failed to fetch student data",
          });
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
