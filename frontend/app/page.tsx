"use client";

import { LoginButton } from "@/components/auth/login-button";
import { setAuthStatus } from "@/redux/slices/authSlice";
import { GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setAuthStatus({
          status: "authenticated",
          user: {
            email: session.user.email as string,
            role: session.user.role as "student" | "viewer",
          },
        })
      );
      router.push("/courses"); // Redirect to courses if authenticated
    }
  }, [session, dispatch, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="flex justify-center mb-8">
          <GraduationCap className="h-20 w-20 text-primary" />
        </div>

        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Welcome to AcademicX
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your comprehensive platform for academic course management and
          learning. Access course materials, share resources, and engage with
          your academic community.
        </p>

        {/* Centered Login Card */}
        <div className="flex flex-col items-center space-y-6">
          <LoginButton
            icon={<GraduationCap className="h-12 w-12 text-primary" />}
            label="User Access"
            description="Students and users will have different access levels."
          />
        </div>

        <div className="mt-12 text-sm text-gray-500 text-center">
          <p>Choose the appropriate login option based on your role.</p>
          <p>
            Students must use their institutional email address
            (@iitbhilai.ac.in).
          </p>
        </div>
      </div>
    </div>
  );
}
