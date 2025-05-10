import React from "react";

// Define types for the props
type SizeType = "sm" | "md" | "lg";
type ColorType =
  | "blue"
  | "indigo"
  | "purple"
  | "teal"
  | "green"
  | "red"
  | "gray";

interface LoaderProps {
  size?: SizeType;
  color?: ColorType;
  text?: string;
}

// A customizable loader component with Tailwind CSS animation
export default function Loader({
  size = "md",
  color = "blue",
  text = "Loading...",
}: LoaderProps) {
  // Size variants
  const sizeClasses: Record<SizeType, string> = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  // Color variants
  const colorClasses: Record<ColorType, string> = {
    blue: "border-blue-200 border-t-blue-600",
    indigo: "border-indigo-200 border-t-indigo-600",
    purple: "border-purple-200 border-t-purple-600",
    teal: "border-teal-200 border-t-teal-600",
    green: "border-green-200 border-t-green-600",
    red: "border-red-200 border-t-red-600",
    gray: "border-gray-200 border-t-gray-600",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <span className="mt-3 text-sm text-gray-600">{text}</span>}
    </div>
  );
}
