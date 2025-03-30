"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  setActiveCourseId,
  setCourses,
  setError,
  setLoading,
} from "@/redux/slices/courseSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CoursesPage() {
  const { data: session } = useSession();

  const { courses, loading, error } = useSelector(
    (state: RootState) => state.course
  );
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCredits, setSelectedCredits] = useState(0);
  const [professorSearch, setProfessorSearch] = useState(""); // Added professor search state

  const navigator = useRouter();

  const backendDomain = "http://localhost:8080";
  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/get_all_courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch the courses");
        }
        const data = await response.json();
        dispatch(setCourses(data));
        dispatch(setLoading(false));
      } catch (error: any) {
        console.log(error);
        dispatch(setError(error.message));
      }
    };
    fetchCourses();
  }, [dispatch]);

  const uniqueProfessors = [
    ...new Set(courses.map((course) => course.professor).filter(Boolean)),
  ];
  const uniqueDepartments = [
    ...new Set(courses.map((course) => course.department).filter(Boolean)),
  ];
  const uniqueCredits = [
    ...new Set(courses.map((course) => course.num_credits).filter(Boolean)),
  ];

  const filteredCourses = courses.filter((course) => {
    return (
      (course.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase().trim())) &&
      course.professor
        .toLowerCase()
        .includes(professorSearch.toLowerCase().trim()) &&
      (selectedProfessor === "" || course.professor === selectedProfessor) &&
      (selectedDepartment === "" || course.department === selectedDepartment) &&
      (selectedCredits === 0 || course.num_credits === selectedCredits)
    );
  });

  const handleViewCourse = (id: number) => {
    dispatch(setLoading(true));
    try {
      dispatch(setActiveCourseId(id));
      navigator.push(`/courses/${id}`);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };

  const handlePostFeedback = (id: number) => {
    dispatch(setLoading(true));
    try {
      dispatch(setActiveCourseId(id));
      navigator.push(`/courses/${id}/feedback`);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Course Catalog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse our comprehensive selection of courses and find detailed
          information about each one.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search by course name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] p-2 border border-gray-300 rounded-lg"
          />

          <Input
            type="text"
            placeholder="Search by professor name..."
            value={professorSearch}
            onChange={(e) => setProfessorSearch(e.target.value)}
            className="flex-1 min-w-[250px] p-2 border border-gray-300 rounded-lg"
          />

          {/* Professor Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Professor:</label>
            <Select
              value={selectedProfessor}
              onValueChange={(value) =>
                setSelectedProfessor(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px] border border-gray-300 shadow-sm hover:bg-gray-100">
                <SelectValue placeholder="All Professors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professors</SelectItem>
                {uniqueProfessors.map(
                  (professor) =>
                    professor && (
                      <SelectItem key={professor} value={professor}>
                        {professor}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Department:</label>
            <Select
              value={selectedDepartment}
              onValueChange={(value) =>
                setSelectedDepartment(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px] border border-gray-300 shadow-sm hover:bg-gray-100">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(
                  (department) =>
                    department && (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Credits Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Credits:</label>
            <Select
              value={selectedCredits.toString()}
              onValueChange={(value) =>
                setSelectedCredits(value === "all" ? 0 : Number(value))
              }
            >
              <SelectTrigger className="w-[150px] border border-gray-300 shadow-sm hover:bg-gray-100">
                <SelectValue placeholder="All Credits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Credits</SelectItem>
                {uniqueCredits.map(
                  (credits) =>
                    credits && (
                      <SelectItem
                        key={credits.toString()}
                        value={credits.toString()}
                      >
                        {credits} Credits
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.professor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleViewCourse(course.id)}
                          variant="default"
                          size="sm"
                        >
                          View Course
                        </Button>
                        {session?.user?.role === "student" && (
                          <Button
                            onClick={() => handlePostFeedback(course.id)}
                            variant="outline"
                            size="sm"
                          >
                            Post Feedback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No courses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
