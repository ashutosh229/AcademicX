// app/post-feedback-viewer/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const feedbackImages = ["/feedback.png"];

export default function PostFeedbackViewerPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? feedbackImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === feedbackImages.length - 1 ? 0 : prev + 1
    );
  };

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

        {/* 📸 Feedback Image Slider */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow">
          <Image
            src={feedbackImages[currentIndex]}
            alt={`Feedback Slide ${currentIndex + 1}`}
            width={800}
            height={450}
            className="w-full h-full object-contain transition-all duration-300 bg-white"
          />

          {/* Prev / Next buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          >
            ▶
          </button>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center mt-4 gap-2">
          {feedbackImages.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === currentIndex ? "bg-gray-800" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
