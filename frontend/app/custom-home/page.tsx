"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, UserCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold text-gray-900 drop-shadow-md">
          Welcome
        </h1>
        <p className="text-lg text-gray-700 mt-3">
          {session?.user.role === "student"
            ? "Access your courses, resources, and academic materials."
            : "Explore available content as a guest user."}
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card
            className="hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/courses")}
          >
            <CardHeader className="flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle>Courses</CardTitle>
              <p className="text-gray-600 text-sm">
                Explore and enroll in courses.
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            <CardHeader className="flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-green-600" />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle>Analytics</CardTitle>
              <p className="text-gray-600 text-sm">
                Findout the numbers for the application
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/about")}
          >
            <CardHeader className="flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-purple-600" />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle>About</CardTitle>
              <p className="text-gray-600 text-sm">
                Get to know the creators and maintainers
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-xl transition cursor-pointer"
            onClick={() => router.push("/contact")}
          >
            <CardHeader className="flex items-center justify-center">
              <UserCircle className="h-12 w-12 text-purple-600" />
            </CardHeader>
            <CardContent className="text-center">
              <CardTitle>Contact</CardTitle>
              <p className="text-gray-600 text-sm">Contact the maintainers</p>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="mt-8"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
