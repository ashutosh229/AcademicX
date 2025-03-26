"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setError, setLoading } from "@/redux/slices/courseSlice";
import { setStudents } from "@/redux/slices/studentSlice";
import { RootState } from "@/redux/store";
import {
  Calendar,
  Edit,
  GraduationCap,
  Star,
  ThumbsUp,
  Trophy,
  UserCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const iconMap: { [key: string]: any } = {
  Star,
  Trophy,
  ThumbsUp,
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { loading, error, students } = useSelector(
    (state: RootState) => state.student
  );
  const dispatch = useDispatch();

  const backendDomain = "http://localhost:8080";

  useEffect(() => {
    const fetchStudets = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/get_all_students/`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Unable to fetch the students");
          toast.error("Unable to fetch the students");
        }
        toast.success("Students fetched successfully");
        const data = await response.json();
        dispatch(setStudents(data));
        dispatch(setLoading(false));
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      }
    };
    fetchStudets();
  }, [dispatch]);

  

  const student = session?.user.email
    ? getUserByEmail(session.user.email)
    : null;

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            No session is active for the user
          </p>
        </div>
      </div>
    );
  }

  if ("error" in student) {
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
    console.log("Student of the college");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <UserCircle className="h-20 w-20 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{student.name}</h1>
                  <p className="text-gray-600">{student.email}</p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/profile/edit">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Batch: {student.batch || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-5 w-5" />
                <span>Branch: {student.branch || "Not specified"}</span>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* <Card className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-lg font-semibold">
                    {user.stats?.totalContributions || 0}
                  </p>
                  <p className="text-gray-600">Total Contributions</p>
                </div>
              </div>
            </Card> */}

            {/* <Card className="p-6">
              <div className="flex items-center gap-3">
                <ThumbsUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-lg font-semibold">
                    {user.stats?.totalUpvotes || 0}
                  </p>
                  <p className="text-gray-600">Total Upvotes</p>
                </div>
              </div>
            </Card> */}

            {/* <Card className="p-6">
              <div className="flex items-center gap-3">
                <ThumbsDown className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-lg font-semibold">
                    {user.stats?.totalDownvotes || 0}
                  </p>
                  <p className="text-gray-600">Total Downvotes</p>
                </div>
              </div>
            </Card> */}
          </div>

          {/* Badges */}
          {/* <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Earned Badges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.stats?.badges?.map((badge) => {
                const IconComponent = iconMap[badge.icon] || Trophy;
                return (
                  <div
                    key={badge.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(badge.dateEarned).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {(!user.stats?.badges || user.stats.badges.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No badges earned yet. Keep contributing to earn badges!</p>
              </div>
            )}
          </Card> */}
        </div>
      </div>
    );
  }
}
