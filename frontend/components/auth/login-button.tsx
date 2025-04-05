"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LoginButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  variant?: "default" | "outline";
  handleClick: () => void;
  inButtonLabel: string;
}

export function LoginButton({
  icon,
  label,
  description,
  variant = "default",
  handleClick,
  inButtonLabel,
}: LoginButtonProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-3">{label}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button
        className="w-full"
        variant={variant}
        onClick={() => handleClick()}
      >
        {inButtonLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
