import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-700 mb-4">
            There was a problem with your authentication attempt.
          </p>
          
          <p className="text-gray-600 mb-6">
            If you're trying to log in as a student, please make sure you're using your institutional email address (@iitbhilai.ac.in).
          </p>
          
          <Button asChild className="w-full">
            <Link href="/">
              Return to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}