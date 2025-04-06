// app/post-feedback-viewer/page.tsx (or pages/post-feedback-viewer.tsx)
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function PostFeedbackViewerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="max-w-2xl w-full p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Restricted Access
          </h1>
        </div>
        <p className="text-gray-700 text-base mb-6">
          In order to maintain the <strong>authenticity</strong> and{" "}
          <strong>integrity</strong> of feedback, guests are not permitted to
          submit course feedback. Below is an example of the feedback submission
          interface available to verified students.
        </p>

        {/* 📸 Sample image of feedback page */}
        <div className="w-full aspect-video overflow-hidden rounded-xl shadow">
          <Image
            src="/images/feedback-form-sample.png" // 🔁 Replace with your actual image path
            alt="Feedback form sample view"
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
        </div>
      </Card>
    </div>
  );
}
