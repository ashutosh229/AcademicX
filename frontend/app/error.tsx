"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error Occurred:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-100 p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-600 mt-2">An unexpected error has occurred.</p>
        <div className="mt-4">
          <Button variant="default" onClick={() => reset()}>
            Try Again
          </Button>
          <a href="/" className="ml-4 text-blue-600 hover:underline">
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
