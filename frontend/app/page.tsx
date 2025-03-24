"use client";

import { LoginButton } from "@/components/auth/login-button";
import { GraduationCap, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/courses");
    }
  }, [status, router]);

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
            label="Student Access"
            description="For enrolled students with institutional credentials. Full access to course materials and feedback."
          />

          {/* Viewer Login Card */}
          <LoginButton
            icon={<Users className="h-12 w-12 text-primary" />}
            label="Viewer Access"
            description="For guests and prospective students. Limited access to view course information."
            variant="outline"
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
