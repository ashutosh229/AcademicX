import { RootState } from "@/redux/store";
import { Course } from "@/types/types";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

export function useCourseFilters() {
  const { courses } = useSelector((state: RootState) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [professorSearch, setProfessorSearch] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCredits, setSelectedCredits] = useState(0);

  const uniqueProfessors = useMemo(
    () => [
      ...new Set(courses.map((course) => course.professor).filter(Boolean)),
    ],
    [courses]
  );

  const uniqueDepartments = useMemo(
    () => [
      ...new Set(courses.map((course) => course.department).filter(Boolean)),
    ],
    [courses]
  );

  const uniqueCredits = useMemo(
    () => [
      ...new Set(courses.map((course) => course.num_credits).filter(Boolean)),
    ],
    [courses]
  );

  const filteredCourses = useMemo(
    () =>
      courses.filter((course: Course) => {
        return (
          (course.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
            course.code
              .toLowerCase()
              .includes(searchTerm.toLowerCase().trim())) &&
          course.professor
            .toLowerCase()
            .includes(professorSearch.toLowerCase().trim()) &&
          (selectedProfessor === "" ||
            course.professor === selectedProfessor) &&
          (selectedDepartment === "" ||
            course.department === selectedDepartment) &&
          (selectedCredits === 0 || course.num_credits === selectedCredits)
        );
      }),
    [
      courses,
      searchTerm,
      professorSearch,
      selectedProfessor,
      selectedDepartment,
      selectedCredits,
    ]
  );

  return {
    searchTerm,
    setSearchTerm,
    professorSearch,
    setProfessorSearch,
    selectedProfessor,
    setSelectedProfessor,
    selectedDepartment,
    setSelectedDepartment,
    selectedCredits,
    setSelectedCredits,
    uniqueProfessors,
    uniqueDepartments,
    uniqueCredits,
    filteredCourses,
  };
}
