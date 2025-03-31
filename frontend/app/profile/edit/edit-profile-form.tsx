"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditStudentProfile } from "@/hooks/custom-hooks/useEditStudentProfile";
import { RootState } from "@/redux/store";
import { Student } from "@/types/types";
import { AlertCircle, Save, UserCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface EditProfileFormProps {
  student: Student;
}

export default function EditProfileForm({ student }: EditProfileFormProps) {
  const { error, loading } = useSelector((state: RootState) => state.student);
  const [formData, setFormData] = useState({
    name: student.name || "",
  });
  const { handleEditProfile, success } = useEditStudentProfile();

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-gray-600">{student.email}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEditProfile(formData.name);
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="batch">Batch Year</Label>
          <Input
            id="batch"
            value={formData.batch}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, batch: e.target.value }))
            }
            placeholder="e.g., 2023"
          />
        </div> */}

        {/* <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={formData.branch}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, branch: e.target.value }))
            }
            placeholder="e.g., Computer Science"
          />
        </div> */}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
            Profile updated successfully! Redirecting...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
}
