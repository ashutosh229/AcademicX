// app/view-course-viewer/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const images = [
  "/metrics_1.png",
  "/metrics_2.png",
  "/resources.png",
  "/comments.png",
];

export default function ViewCourseViewerPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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

        {/* 📸 Image Slider */}
        <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow">
          <Image
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            width={800}
            height={450}
            className="w-full h-full object-cover transition-all duration-300"
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
          {images.map((_, i) => (
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
