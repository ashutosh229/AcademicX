"use client";

import { setError, setLoading } from "@/redux/slices/studentSlice";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function useEditStudentProfile() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleEditProfile = async (name: string) => {
    dispatch(setLoading(true));
    setSuccess(false);

    try {
      const response = await fetch(`${backendDomain}/edit_student_name/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user.email?.toString(),
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update the student's name");
      }

      toast.success("Updated the name of the user successfully");
      setSuccess(true);
      router.push("/profile");
    } catch (error: any) {
      console.error(error);
      dispatch(setError(error.message));
      toast.error(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleEditProfile, success };
}
