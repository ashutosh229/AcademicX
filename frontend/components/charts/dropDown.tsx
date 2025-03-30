"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gradeMapping } from "@/types/types";
import { useState } from "react";

interface GradeDropdownProps {
  onChange: (value: number) => void;
}

export default function GradeDropdown({ onChange }: GradeDropdownProps) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const handleSelect = (grade: string) => {
    setSelectedGrade(grade);
    onChange(gradeMapping[grade]); // Pass numerical value to parent component
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Grade Obtained</Label>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a grade" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(gradeMapping).map((grade) => (
            <SelectItem key={grade} value={grade}>
              {grade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedGrade && (
        <p className="text-sm text-gray-500">
          Selected Grade: {gradeMapping[selectedGrade]}
        </p>
      )}
    </div>
  );
}
