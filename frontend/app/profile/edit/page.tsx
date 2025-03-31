"use client";

import { useFetchStudentProfile } from "@/hooks/custom-hooks/useFetchStudentProfile";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import EditProfileForm from "./edit-profile-form";

export default function EditProfilePage() {
  const { activeStudent } = useSelector((state: RootState) => state.student);

  useFetchStudentProfile();

  if (!activeStudent) {
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
  } else {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EditProfileForm student={activeStudent} />
        </div>
      </div>
    );
  }
}
