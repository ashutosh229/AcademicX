"use client";

import { LoginButton } from "@/components/auth/login-button";
import useAuthenticationRedirection from "@/hooks/custom-hooks/useAuthenticationRedirection";
import { RootState } from "@/redux/store";
import { GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";

export default function WelcomePage() {
  const { status } = useSelector((state: RootState) => state.auth);

  useAuthenticationRedirection();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center max-w-3xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <GraduationCap className="h-20 w-20 text-primary" />
        </div>

        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Welcome to AcademicX
        </h1>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Your comprehensive platform for academic course management and
          learning. Access course materials, share resources, and engage with
          your academic community.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Student Login Card */}
          <LoginButton
            icon={<GraduationCap className="h-12 w-12 text-primary" />}
            label="User Access"
            description="Students and users will have different access levels."
          />
        </div>

        <div className="mt-12 text-sm text-gray-500">
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
