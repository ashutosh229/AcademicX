"use client";

import { getUserByEmail } from "@/lib/auth-utils";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import EditProfileForm from "./edit-profile-form";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const { students } = useSelector((state: RootState) => state.student);

  const student = session?.user?.email
    ? getUserByEmail(session.user.email, session, students)
    : null;

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            No active session present for the user
          </p>
        </div>
      </div>
    );
  } else if ("error" in student) {
    console.log("Internal server error occured");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Internal server error occured</p>
        </div>
      </div>
    );
  } else if ("role" in student) {
    console.log("Viewer access is given");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Viewers cannot access this page</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EditProfileForm student={student} />
        </div>
      </div>
    );
  }
}
