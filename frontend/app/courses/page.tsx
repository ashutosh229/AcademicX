"use client";

//dummy commit

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
import { setCourseFeedback } from "@/redux/slices/studentSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  backendDomain,
  Course,
  CourseMetadata,
  FilterState,
} from "@/types/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const coursesLoadedRef = useRef(false);
  const pendingRequestsRef = useRef(new Map());
  const { data: session, status } = useSession();
  const { courses } = useSelector((state: RootState) => state.course);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    professorSearch: "",
    selectedDepartment: "",
    selectedCredits: "",
  });

  useEffect(() => {
    // Prevent redundant API calls if data is already loaded
    if (coursesLoadedRef.current || status !== "authenticated") return;

    const fetchCourses = async () => {
      dispatch(setLoading(true));

      // Create an abort controller for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(`${backendDomain}/get_all_courses/`, {
          signal: controller.signal,
          cache: "default",
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        const dataDebug = await response.json();
        console.log(dataDebug);

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch the courses");
        }

        const data = await response.json();
        dispatch(setCourses(data));
        coursesLoadedRef.current = true;
      } catch (error: any) {
        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out"
            : error.message || "Error loading courses";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCourses();
  }, [dispatch, session, status]);

  const handleViewCourse = useCallback(
    (id: number) => {
      if (session?.user.role === "viewer") {
        router.push("/view-course-viewer");
        return;
      }
      // This operation is synchronous, no need for loading state
      dispatch(setActiveCourseId(id));
      router.push(`/courses/${id}`);
    },
    [dispatch, router, session]
  );

  const handlePostFeedback = useCallback(
    async (id: number) => {
      if (session?.user.role === "viewer") {
        router.push("/post-feedback-viewer");
        return;
      }
      // Prevent duplicate requests for the same course/email
      const email = session?.user.email?.toString();
      const requestKey = `${id}-${email}`;
      if (pendingRequestsRef.current.get(requestKey)) return;

      pendingRequestsRef.current.set(requestKey, true);
      dispatch(setLoading(true));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        if (!email) {
          throw new Error("User email is required");
        }

        dispatch(setActiveCourseId(id));

        const response = await fetch(`${backendDomain}/user_course_feedback/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            email: email,
            course_id: id,
          }),
        });

        clearTimeout(timeoutId);

        if (response.status === 404) {
          router.push(`/courses/${id}/feedback`);
        } else if (response.ok) {
          const data = await response.json();
          dispatch(setCourseFeedback(data));
          router.push(`/courses/${id}/feedback/show`);
        } else {
          throw new Error(`Unexpected response: ${response.status}`);
        }
      } catch (error: any) {
        const errorMessage =
          error.name === "AbortError"
            ? "Request timed out"
            : error.message || "Error processing feedback";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
        pendingRequestsRef.current.delete(requestKey);
      }
    },
    [dispatch, router, session]
  );

  const courseMetadata = useMemo<CourseMetadata>(() => {
    const departments = new Set<string>();
    const credits = new Set<string>();

    courses.forEach((course: Course) => {
      if (course.department) departments.add(course.department);
      if (course.num_credits) credits.add(course.num_credits);
    });

    return {
      uniqueDepartments: Array.from(departments),
      uniqueCredits: Array.from(credits),
    };
  }, [courses]);

  const updateFilter = useCallback(
    (filterName: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    },
    []
  );

  const filteredCourses = useMemo<Course[]>(() => {
    const {
      searchTerm,
      professorSearch,
      // selectedProfessor,
      selectedDepartment,
      selectedCredits,
    } = filters;

    // Create lowercase trimmed versions once to avoid repetition
    const searchTermLower = searchTerm.toLowerCase().trim();
    const professorSearchLower = professorSearch.toLowerCase().trim();

    // Return early if no filters are applied
    if (
      !searchTermLower &&
      !professorSearchLower &&
      // !selectedProfessor &&
      !selectedDepartment &&
      !selectedCredits
    ) {
      return courses;
    }

    return courses.filter((course: Course) => {
      // First check the most restrictive filters
      // if (selectedProfessor && course.professor !== selectedProfessor)
      //   return false;
      if (selectedDepartment && course.department !== selectedDepartment)
        return false;
      if (selectedCredits && course.num_credits !== selectedCredits)
        return false;

      // Then check text-based filters
      if (
        searchTermLower &&
        !(
          course.name.toLowerCase().includes(searchTermLower) ||
          course.code.toLowerCase().includes(searchTermLower)
        )
      ) {
        return false;
      }

      if (
        professorSearchLower &&
        !course.professor.toLowerCase().includes(professorSearchLower)
      ) {
        return false;
      }

      return true;
    });
  }, [courses, filters]);

  const searchTerm = filters.searchTerm;
  const setSearchTerm = (value: string) => updateFilter("searchTerm", value);
  const professorSearch = filters.professorSearch;
  const setProfessorSearch = (value: string) =>
    updateFilter("professorSearch", value);
  const selectedDepartment = filters.selectedDepartment;
  const setSelectedDepartment = (value: string) =>
    updateFilter("selectedDepartment", value);
  const selectedCredits = filters.selectedCredits;
  const setSelectedCredits = (value: string) =>
    updateFilter("selectedCredits", value);
  const uniqueDepartments = courseMetadata.uniqueDepartments;
  const uniqueCredits = courseMetadata.uniqueCredits;

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
              value={selectedCredits}
              onValueChange={(value) =>
                setSelectedCredits(value === "all" ? "" : value)
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
                      <SelectItem key={credits} value={credits}>
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
                <TableHead>Department</TableHead>
                <TableHead>Credits</TableHead>
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
                    <TableCell>{course.department}</TableCell>
                    <TableCell>{course.num_credits}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleViewCourse(course.id)}
                          variant="default"
                          size="sm"
                        >
                          View Course
                        </Button>
                        <Button
                          onClick={() => handlePostFeedback(course.id)}
                          variant="outline"
                          size="sm"
                        >
                          Post Feedback
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">Loading...</p>
                    </div>
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
