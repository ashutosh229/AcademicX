// app/view-course-viewer/page.tsx (or pages/view-course-viewer.tsx)
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Image from "next/image";

export default function ViewCourseViewerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="max-w-2xl w-full p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Restricted Access
          </h1>
        </div>
        <p className="text-gray-700 text-base mb-6">
          To ensure <strong>student privacy</strong> and{" "}
          <strong>data integrity</strong>, we regret to inform you that this
          page cannot be shown to guests. Kindly refer to the image below to
          observe how this page is displayed to the students.
        </p>

        {/* 📸 Sample image of student view */}
        <div className="w-full aspect-video overflow-hidden rounded-xl shadow">
          <Image
            src="/images/student-view-sample.png" // 🔁 Replace this with your actual image path
            alt="Student view sample"
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
        </div>
      </Card>
    </div>
  );
}
