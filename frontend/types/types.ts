// Temporary data store until API integration
export interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  department: string;
  num_credits: string;
}

export interface Resource {
  id: number
  name: string;
  remarks: string;
  url: string;
  upvotes: number;
  downvotes: number;
  date_added: string;
  user_vote: number;
  contributor: {
    name: string;
    isAnonymous: boolean;
    email: string;
    batch: string;
    degree: string;
    branch: string;
  };
}

export interface Comment {
  id: number;
  text: string;
  upvotes: number;
  downvotes: number;
  date_posted: string;
  user_vote: number;
  author: {
    name: string;
    isAnonymous: boolean;
    email: string;
    batch: string;
    degree: string;
    branch: string;
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

export const backendDomain = "http://localhost:8080"

// Define types for filter state
export interface FilterState {
  searchTerm: string;
  professorSearch: string;
  selectedProfessor: string;
  selectedDepartment: string;
  selectedCredits: string;
}

// Define types for course metadata
export interface CourseMetadata {
  uniqueProfessors: string[];
  uniqueDepartments: string[];
  uniqueCredits: string[];
}

// Define return type for the hook
export interface CourseFiltersResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  professorSearch: string;
  setProfessorSearch: (value: string) => void;
  selectedProfessor: string;
  setSelectedProfessor: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedCredits: string;
  setSelectedCredits: (value: string) => void;
  uniqueProfessors: string[];
  uniqueDepartments: string[];
  uniqueCredits: string[];
  filteredCourses: Course[];
}

// Define analytics data type
export interface AnalyticsData {
  [key: string]: number;
}

// Define return type for the hook
export interface AnalyticsResult {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
}

export interface Student {
  email: string;
  name: string;
  branch: string;
  batch: string;
  activated: boolean;
  degree: string
}

export interface Feedback {
  id: number,
  content_toughness: number,
  teaching_quality: number,
  workload: number,
  exam_difficulty: number,
  grading_strictness: number,
  resources_provided: number,
  recommendation: number,
  grade_obtained: number,
  course: number,
  contributor: string,
}

export interface StudentState {
  students: Student[],
  loading: boolean,
  error: string | null,
  activeStudent: Student | null,
  courseFeedback: Feedback | null,
}

export interface AuthUser {
  email: string;
  role: 'student' | 'viewer';
  name?: string;
  image?: string;
}

export interface AuthState {
  status: 'authenticated' | 'unauthenticated' | 'loading';
  user: AuthUser | null;
}

// Define an interface for the reducer payload
export interface AuthPayload {
  status: AuthState["status"];
  user?: AuthState["user"];
}








