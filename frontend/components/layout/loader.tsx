import React from "react";

// Define types for the props
type SizeType = "xs" | "sm" | "md" | "lg" | "xl";
type ColorType =
  | "blue"
  | "indigo"
  | "purple"
  | "teal"
  | "green"
  | "red"
  | "gray"
  | "amber"
  | "pink";

type SpinnerType = "border" | "dots" | "pulse" | "dual-ring" | "ripple";

interface LoaderProps {
  size?: SizeType;
  color?: ColorType;
  text?: string;
  type?: SpinnerType;
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

// A customizable loader component with Tailwind CSS animation
export default function Loader({
  size = "md",
  color = "blue",
  text = "Loading...",
  type = "border",
  speed = "normal",
  className = "",
}: LoaderProps) {
  // Size variants
  const sizeClasses: Record<SizeType, string> = {
    xs: "w-4 h-4 border",
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-2",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
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
    amber: "border-amber-200 border-t-amber-600",
    pink: "border-pink-200 border-t-pink-600",
  };

  // Speed variants
  const speedClasses: Record<string, string> = {
    slow: "animate-spin-slow", // Define this in tailwind.config.js
    normal: "animate-spin",
    fast: "animate-spin-fast", // Define this in tailwind.config.js
  };

  // Text color to match the spinner
  const textColorClasses: Record<ColorType, string> = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    teal: "text-teal-600",
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-600",
    amber: "text-amber-600",
    pink: "text-pink-600",
  };

  // Different spinner types
  const renderSpinner = () => {
    switch (type) {
      case "border":
        return (
          <div
            className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${speedClasses[speed]}`}
            role="status"
            aria-label="loading"
          />
        );
      case "dots":
        // Three bouncing dots
        return (
          <div className="flex space-x-2">
            <div
              className={`rounded-full bg-current ${
                size === "xs"
                  ? "w-1 h-1"
                  : size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                  ? "w-3 h-3"
                  : size === "lg"
                  ? "w-4 h-4"
                  : "w-5 h-5"
              } ${textColorClasses[color]} animate-bounce`}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={`rounded-full bg-current ${
                size === "xs"
                  ? "w-1 h-1"
                  : size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                  ? "w-3 h-3"
                  : size === "lg"
                  ? "w-4 h-4"
                  : "w-5 h-5"
              } ${textColorClasses[color]} animate-bounce`}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={`rounded-full bg-current ${
                size === "xs"
                  ? "w-1 h-1"
                  : size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                  ? "w-3 h-3"
                  : size === "lg"
                  ? "w-4 h-4"
                  : "w-5 h-5"
              } ${textColorClasses[color]} animate-bounce`}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        );
      case "pulse":
        // Pulsing circle
        return (
          <div
            className={`rounded-full bg-current ${sizeClasses[size]} ${textColorClasses[color]} animate-pulse`}
            role="status"
            aria-label="loading"
          />
        );
      case "dual-ring":
        // Two spinning rings
        return (
          <div className="relative">
            <div
              className={`absolute rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${speedClasses[speed]}`}
              role="status"
              aria-label="loading"
            />
            <div
              className={`rounded-full ${sizeClasses[size]} border-transparent border-t-gray-300 animate-spin`}
              style={{ animationDirection: "reverse", opacity: 0.5 }}
              aria-hidden="true"
            />
          </div>
        );
      case "ripple":
        // Ripple effect
        return (
          <div className="relative">
            <div
              className={`absolute rounded-full ${sizeClasses[size]} border-2 border-current ${textColorClasses[color]} animate-ping`}
              style={{ animationDuration: "1.5s" }}
              aria-hidden="true"
            />
            <div
              className={`rounded-full ${
                size === "xs"
                  ? "w-2 h-2"
                  : size === "sm"
                  ? "w-3 h-3"
                  : size === "md"
                  ? "w-5 h-5"
                  : size === "lg"
                  ? "w-8 h-8"
                  : "w-12 h-12"
              } bg-current ${textColorClasses[color]}`}
              role="status"
              aria-label="loading"
            />
          </div>
        );
      default:
        return (
          <div
            className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${speedClasses[speed]}`}
            role="status"
            aria-label="loading"
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <span className={`mt-3 text-sm ${textColorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );
}
