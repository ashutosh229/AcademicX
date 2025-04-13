"use client";

import { LoginButton } from "@/components/auth/login-button";
import { setAuthStatus } from "@/redux/slices/authSlice";
import { GraduationCap, Users } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      return controller.abort();
    }, 3000);
    fetch("https://iit-bhilai-student-forum.onrender.com/warmup/", {
      signal: controller.signal,
    }).catch((error) => console.log("Warmup failed", error));
    return () => clearTimeout(timeout);
  }, []);

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
      router.push("/custom-home");
    }
  }, [session, dispatch, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLoginForStudent = () => {
    signIn("google");
  };

  const handleLoginForViewer = async () => {
    const res = await signIn("credentials", {
      login: "Guest Login",
      name: "Viewer",
      redirect: false,
    });
    if (res?.ok) {
      router.push("/custom-home");
    } else {
      alert("Login Failed");
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-3xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <GraduationCap className="h-20 w-20 text-primary" />
          </div>

          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Welcome to IIT Bhilai Student Forum
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
              handleClick={handleLoginForStudent}
              inButtonLabel="Login with Google"
            />

            {/* Viewer Login Card */}
            <LoginButton
              icon={<Users className="h-12 w-12 text-primary" />}
              label="Viewer Access"
              description="For guests and prospective students. Limited access to view course information."
              variant="outline"
              handleClick={handleLoginForViewer}
              inButtonLabel="View as Guest"
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
    </>
  );
}
