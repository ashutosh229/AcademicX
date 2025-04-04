import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-700 mb-4">
            You need to be logged in to access this page.
          </p>

          <p className="text-gray-600 mb-6">
            Please log in with your account to continue.
          </p>

          <Button asChild className="w-full">
            <Link href="/">Go to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
