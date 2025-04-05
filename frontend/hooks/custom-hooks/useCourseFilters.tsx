"use client";

import { RootState } from "@/redux/store";
import {
  Course,
  CourseFiltersResult,
  CourseMetadata,
  FilterState,
} from "@/types/types";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export function useCourseFilters(): CourseFiltersResult {
  const { courses } = useSelector((state: RootState) => state.course);

  // Group filter states together to reduce re-renders
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    professorSearch: "",
    // selectedProfessor: "",
    selectedDepartment: "",
    selectedCredits: "",
  });

  // Memoize course metadata to prevent recalculation
  const courseMetadata = useMemo<CourseMetadata>(() => {
    // Create sets for faster lookups
    // const professors = new Set<string>();
    const departments = new Set<string>();
    const credits = new Set<string>();

    courses.forEach((course: Course) => {
      // if (course.professor) professors.add(course.professor);
      if (course.department) departments.add(course.department);
      if (course.num_credits) credits.add(course.num_credits);
    });

    return {
      // uniqueProfessors: Array.from(professors),
      uniqueDepartments: Array.from(departments),
      uniqueCredits: Array.from(credits),
    };
  }, [courses]);

  // Optimized filter handlers that only update necessary state
  const updateFilter = useCallback(
    (filterName: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    },
    []
  );

  // Memoized filtered courses with optimized filtering logic
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

  return {
    searchTerm: filters.searchTerm,
    setSearchTerm: (value: string) => updateFilter("searchTerm", value),
    professorSearch: filters.professorSearch,
    setProfessorSearch: (value: string) =>
      updateFilter("professorSearch", value),
    // selectedProfessor: filters.selectedProfessor,
    // setSelectedProfessor: (value: string) =>
    //   updateFilter("selectedProfessor", value),
    selectedDepartment: filters.selectedDepartment,
    setSelectedDepartment: (value: string) =>
      updateFilter("selectedDepartment", value),
    selectedCredits: filters.selectedCredits,
    setSelectedCredits: (value: string) =>
      updateFilter("selectedCredits", value),
    // uniqueProfessors: courseMetadata.uniqueProfessors,
    uniqueDepartments: courseMetadata.uniqueDepartments,
    uniqueCredits: courseMetadata.uniqueCredits,
    filteredCourses,
  };
}
