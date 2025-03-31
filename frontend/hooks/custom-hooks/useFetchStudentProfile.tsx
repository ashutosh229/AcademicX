"use client";

import {
  setActiveStudent,
  setError,
  setLoading,
} from "@/redux/slices/studentSlice";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function useFetchStudentProfile() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchStudents = async () => {
      dispatch(setLoading(true));

      try {
        const response = await fetch(
          `${backendDomain}/get_student_profile/${session.user.email}/`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch the students");
        }

        const data = await response.json();
        dispatch(setActiveStudent(data));
        toast.success("Students fetched successfully");
      } catch (error: any) {
        console.error("Fetch error:", error);
        dispatch(setError(error.message));
        toast.error(error.message);
      } finally {
        dispatch(setLoading(false)); // Ensure loading is set to false
      }
    };

    fetchStudents();
  }, [session?.user?.email, dispatch]);
}
