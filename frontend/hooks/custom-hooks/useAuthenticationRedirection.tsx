"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function useAuthenticationRedirection(redirectPath: string = "/courses") {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(redirectPath);
    }
  }, [status, router, redirectPath]);
}

export default useAuthenticationRedirection;
