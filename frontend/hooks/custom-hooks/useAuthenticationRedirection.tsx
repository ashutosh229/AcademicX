"use client";

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function useAuthenticationRedirection(redirectPath: string = "/courses") {
  const { status } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push(redirectPath);
    }
  }, [status, router, redirectPath]);
}

export default useAuthenticationRedirection;
