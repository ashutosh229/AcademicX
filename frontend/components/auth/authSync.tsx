"use client";

import { clearAuth, setAuthStatus } from "@/redux/slices/authSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setAuthStatus({ status: "loading", user: null }));
    } else if (status === "authenticated" && session && session.user) {
      dispatch(
        setAuthStatus({
          status: "authenticated",
          user: {
            email: session.user.email || "",
            role: (session.user.role as "student" | "viewer") || "viewer",
            name: session.user.name || undefined,
            image: session.user.image || undefined,
          },
        })
      );
    } else {
      dispatch(clearAuth());
    }
  }, [status, session, dispatch]);
  return null;
}
