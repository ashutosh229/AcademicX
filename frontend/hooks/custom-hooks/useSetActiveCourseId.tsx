import { setActiveCourseId } from "@/redux/slices/courseSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function useActiveCourse() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const courseId = Number(params?.id);

    if (!isNaN(courseId) && courseId > 0) {
      dispatch(setActiveCourseId(courseId));
    } else {
      setTimeout(() => router.push("/courses"), 1000);
    }
  }, [params, dispatch, router]);

  return { courseId: Number(params?.id) || null };
}
