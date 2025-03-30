// Temporary data store until API integration
export interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  department: string;
  num_credits: number;
}

export interface Student {
  email: string;
  name: string;
  branch: string;
  batch: string;
  activated: boolean
}

export interface StudentState {
  students: Student[],
  loading: boolean,
  error: string | null,
}

export interface Resource {
  id: number
  name: string;
  remarks: string;
  url: string;
  upvotes: number;
  downvotes: number;
  dateAdded: string;
  contributor: {
    name: string;
    isAnonymous: boolean;
    email: string
  };
}

export interface Comment {
  id: number;
  text: string;
  upvotes: number;
  downvotes: number;
  datePosted: string;
  author: {
    name: string;
    isAnonymous: boolean;
    email: string
  };
}

export interface CourseMetrics {
  contentToughness: {
    average: number; // 1-10
    distribution: { value: number; count: number }[];
  };
  teachingQuality: {
    average: number; // 1-10
    distribution: { value: number; count: number }[];
  };
  workload: {
    average: number;
    distribution: { value: number; count: number }[]
  };
  examDifficulty: {
    average: number;
    distribution: { value: number; count: number }[]
  };
  gradingStrictness: {
    average: number;
    distribution: { value: number; count: number }[]
  };
  resourcesProvided: {
    average: number;
    distribution: { value: number; count: number }[]
  };
  recommendation: {
    average: number;
    distribution: {
      value: number;
      count: number
    }[]
  };
  gradeObtained: {
    average: number;
    distribution: {
      value: number;
      count: number
    }[]
  }
}

export interface CourseDetails {
  course: Course,
  resources: Resource[],
  comments: Comment[],
  metrics: CourseMetrics,
}

export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  activeCourseId: number | null;
}

export const gradeMapping: Record<string, number> = {
  "A+": 10,
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  "C-": 5,
  D: 4,
  F: 0,
  "FS": 0,
  I: 0
};








