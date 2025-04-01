"use client";

import { setError, setLoading } from "@/redux/slices/courseSlice";
import { CourseDetails } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../use-toast";

const useFetchCourseDetails = (
  backendDomain: string,
  session: any,
  activeCourseId: number | null
) => {
  const { toast } = useToast();
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const dispatch = useDispatch();

  const fetchDetails = useCallback(async () => {
    if (!activeCourseId || !session?.user?.email) return;
    dispatch(setLoading(true));

    try {
      const response = await fetch(`${backendDomain}/get_course_details/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: session.user.email.toString(),
          course_id: activeCourseId,
        }),
      });

      if (!response.ok) {
        throw new Error("Course details could not be fetched properly");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Successfully fetched the courses",
      });
      setCourseData(data);
    } catch (error: any) {
      console.error(error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [backendDomain, session, activeCourseId, dispatch]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { courseData, refreshCourseDetails: fetchDetails };
};

export default useFetchCourseDetails;
