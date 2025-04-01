"use client";

import { setError, setLoading } from "@/redux/slices/studentSlice";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../use-toast";

export function useEditStudentProfile() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const pendingRequestRef = useRef(false);
  const { toast } = useToast();

  const handleEditProfile = useCallback(
    async (name: string) => {
      // Prevent duplicate submissions
      if (pendingRequestRef.current) return;
      pendingRequestRef.current = true;

      dispatch(setLoading(true));
      setSuccess(false);

      try {
        const email = session?.user?.email;

        if (!email) {
          throw new Error("User email not available");
        }

        if (!name || name.trim() === "") {
          throw new Error("Name cannot be empty");
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${backendDomain}/edit_student_name/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Unable to update the student's name"
          );
        }

        toast({
          title: "Success",
          description: "Updated the name of the user successfully",
        });
        setSuccess(true);
        router.push("/profile");
      } catch (error: any) {
        console.error("Profile update error:", error);
        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out"
            : error.message || "Failed to update profile";

        dispatch(setError(errorMessage));
        toast({
          title: "Error",
          description: errorMessage,
        });
      } finally {
        dispatch(setLoading(false));
        pendingRequestRef.current = false;
      }
    },
    [session, dispatch, router]
  );

  return { handleEditProfile, success };
}
