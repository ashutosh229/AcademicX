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
import { useCourseFilters } from "@/hooks/custom-hooks/useCourseFilters";
import { useCourseHandlers } from "@/hooks/custom-hooks/useCourseHandlers";
import { useSession } from "next-auth/react";

export default function CoursesPage() {

  const {
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedCredits,
    setSelectedCredits,
    professorSearch,
    setProfessorSearch,
    filteredCourses,
    uniqueDepartments,
    uniqueCredits,
  } = useCourseFilters();

  const { handleViewCourse, handlePostFeedback } = useCourseHandlers();

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
