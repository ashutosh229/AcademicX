"use client";

import { setActiveCourseId } from "@/redux/slices/courseSlice";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useDispatch } from "react-redux";
import FeedbackForm from "./feedback-form";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Unwrap the params promise using use()
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      dispatch(setActiveCourseId(Number(id))); // Ensure `id` is a number
    } else {
      router.push("/courses");
    }
  }, [id, dispatch, router]);

  return <FeedbackForm />;
}
