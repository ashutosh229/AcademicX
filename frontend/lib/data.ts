// Temporary data store until API integration
export interface Course {
  course_id: string;
  name: string;
  code: string;
  professor: string;
  metrics: CourseMetrics;
  resources: Resource[];
  comments: Comment[];
  department: string;
  credits: number;
}

export interface CourseMetrics {
  contentToughness: {
    average: number; // 1-10
    distribution: { value: number; count: number }[];
  };
  workload: {
    average: number; // 1-10
    distribution: { value: number; count: number }[];
  };
  overallRecommendation: {
    recommended: number;
    notRecommended: number;
  };
  teachingQuality: {
    average: number;
    distribution: {
      value: number;
      count: number;
    }
  };
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  url: string;
  contributor: {
    name: string;
    isAnonymous: boolean;
  };
  upvotes: number;
  downvotes: number;
  dateAdded: string;
}

export interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    isAnonymous: boolean;
  };
  upvotes: number;
  downvotes: number;
  datePosted: string;
}

export const courses: Course[] = [
  {
    course_id: "1",
    name: "Introduction to Computer Science",
    code: "CS101",
    professor: "Dr. Sarah Johnson",
    department: "CSE",
    credits: 4,
    metrics: {
      contentToughness: {
        average: 6,
        distribution: [
          { value: 1, count: 2 },
          { value: 2, count: 5 },
          { value: 3, count: 8 },
          { value: 4, count: 15 },
          { value: 5, count: 20 },
          { value: 6, count: 25 },
          { value: 7, count: 18 },
          { value: 8, count: 12 },
          { value: 9, count: 6 },
          { value: 10, count: 3 }
        ]
      },
      workload: {
        average: 7,
        distribution: [
          { value: 1, count: 1 },
          { value: 2, count: 3 },
          { value: 3, count: 7 },
          { value: 4, count: 12 },
          { value: 5, count: 18 },
          { value: 6, count: 22 },
          { value: 7, count: 25 },
          { value: 8, count: 15 },
          { value: 9, count: 8 },
          { value: 10, count: 4 }
        ]
      },
      overallRecommendation: {
        recommended: 85,
        notRecommended: 15
      }
    },
    resources: [
      {
        id: "r1",
        name: "Lecture Notes - Week 1-5",
        type: "Notes",
        url: "https://drive.google.com/example1",
        contributor: {
          name: "John Smith",
          isAnonymous: false
        },
        upvotes: 45,
        downvotes: 2,
        dateAdded: "2024-03-15"
      },
      {
        id: "r2",
        name: "Practice Problems Set",
        type: "Exercises",
        url: "https://drive.google.com/example2",
        contributor: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 32,
        downvotes: 5,
        dateAdded: "2024-03-10"
      }
    ],
    comments: [
      {
        id: "c1",
        text: "Great introductory course! The professor explains concepts very clearly.",
        author: {
          name: "Alice Johnson",
          isAnonymous: false
        },
        upvotes: 25,
        downvotes: 1,
        datePosted: "2024-03-01"
      },
      {
        id: "c2",
        text: "Challenging but rewarding. Make sure to start assignments early.",
        author: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 18,
        downvotes: 2,
        datePosted: "2024-02-28"
      }
    ]
  },
  {
    course_id: "2",
    name: "Introduction to Deep Learning",
    code: "DS201",
    professor: "Dr. Sarah Johnson",
    department: "CSE",
    credits: 4,
    metrics: {
      contentToughness: {
        average: 6,
        distribution: [
          { value: 1, count: 2 },
          { value: 2, count: 5 },
          { value: 3, count: 8 },
          { value: 4, count: 15 },
          { value: 5, count: 20 },
          { value: 6, count: 25 },
          { value: 7, count: 18 },
          { value: 8, count: 12 },
          { value: 9, count: 6 },
          { value: 10, count: 3 }
        ]
      },
      workload: {
        average: 7,
        distribution: [
          { value: 1, count: 1 },
          { value: 2, count: 3 },
          { value: 3, count: 7 },
          { value: 4, count: 12 },
          { value: 5, count: 18 },
          { value: 6, count: 22 },
          { value: 7, count: 25 },
          { value: 8, count: 15 },
          { value: 9, count: 8 },
          { value: 10, count: 4 }
        ]
      },
      overallRecommendation: {
        recommended: 85,
        notRecommended: 15
      }
    },
    resources: [
      {
        id: "r1",
        name: "Lecture Notes - Week 1-5",
        type: "Notes",
        url: "https://drive.google.com/example1",
        contributor: {
          name: "John Smith",
          isAnonymous: false
        },
        upvotes: 45,
        downvotes: 2,
        dateAdded: "2024-03-15"
      },
      {
        id: "r2",
        name: "Practice Problems Set",
        type: "Exercises",
        url: "https://drive.google.com/example2",
        contributor: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 32,
        downvotes: 5,
        dateAdded: "2024-03-10"
      }
    ],
    comments: [
      {
        id: "c1",
        text: "Great introductory course! The professor explains concepts very clearly.",
        author: {
          name: "Alice Johnson",
          isAnonymous: false
        },
        upvotes: 25,
        downvotes: 1,
        datePosted: "2024-03-01"
      },
      {
        id: "c2",
        text: "Challenging but rewarding. Make sure to start assignments early.",
        author: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 18,
        downvotes: 2,
        datePosted: "2024-02-28"
      }
    ]
  },
  {
    course_id: "3",
    name: "Introduction to Mechanical Properties of Solids",
    code: "ME230",
    professor: "Dr. Sarah Johnson",
    department: "ME",
    credits: 3,
    metrics: {
      contentToughness: {
        average: 6,
        distribution: [
          { value: 1, count: 2 },
          { value: 2, count: 5 },
          { value: 3, count: 8 },
          { value: 4, count: 15 },
          { value: 5, count: 20 },
          { value: 6, count: 25 },
          { value: 7, count: 18 },
          { value: 8, count: 12 },
          { value: 9, count: 6 },
          { value: 10, count: 3 }
        ]
      },
      workload: {
        average: 7,
        distribution: [
          { value: 1, count: 1 },
          { value: 2, count: 3 },
          { value: 3, count: 7 },
          { value: 4, count: 12 },
          { value: 5, count: 18 },
          { value: 6, count: 22 },
          { value: 7, count: 25 },
          { value: 8, count: 15 },
          { value: 9, count: 8 },
          { value: 10, count: 4 }
        ]
      },
      overallRecommendation: {
        recommended: 85,
        notRecommended: 15
      }
    },
    resources: [
      {
        id: "r1",
        name: "Lecture Notes - Week 1-5",
        type: "Notes",
        url: "https://drive.google.com/example1",
        contributor: {
          name: "John Smith",
          isAnonymous: false
        },
        upvotes: 45,
        downvotes: 2,
        dateAdded: "2024-03-15"
      },
      {
        id: "r2",
        name: "Practice Problems Set",
        type: "Exercises",
        url: "https://drive.google.com/example2",
        contributor: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 32,
        downvotes: 5,
        dateAdded: "2024-03-10"
      }
    ],
    comments: [
      {
        id: "c1",
        text: "Great introductory course! The professor explains concepts very clearly.",
        author: {
          name: "Alice Johnson",
          isAnonymous: false
        },
        upvotes: 25,
        downvotes: 1,
        datePosted: "2024-03-01"
      },
      {
        id: "c2",
        text: "Challenging but rewarding. Make sure to start assignments early.",
        author: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 18,
        downvotes: 2,
        datePosted: "2024-02-28"
      }
    ]
  },
  {
    course_id: "4",
    name: "Introduction to Electrical machines",
    code: "EE210",
    professor: "Dr. Sarah Johnson",
    department: "EE",
    credits: 2,
    metrics: {
      contentToughness: {
        average: 6,
        distribution: [
          { value: 1, count: 2 },
          { value: 2, count: 5 },
          { value: 3, count: 8 },
          { value: 4, count: 15 },
          { value: 5, count: 20 },
          { value: 6, count: 25 },
          { value: 7, count: 18 },
          { value: 8, count: 12 },
          { value: 9, count: 6 },
          { value: 10, count: 3 }
        ]
      },
      workload: {
        average: 7,
        distribution: [
          { value: 1, count: 1 },
          { value: 2, count: 3 },
          { value: 3, count: 7 },
          { value: 4, count: 12 },
          { value: 5, count: 18 },
          { value: 6, count: 22 },
          { value: 7, count: 25 },
          { value: 8, count: 15 },
          { value: 9, count: 8 },
          { value: 10, count: 4 }
        ]
      },
      overallRecommendation: {
        recommended: 85,
        notRecommended: 15
      }
    },
    resources: [
      {
        id: "r1",
        name: "Lecture Notes - Week 1-5",
        type: "Notes",
        url: "https://drive.google.com/example1",
        contributor: {
          name: "John Smith",
          isAnonymous: false
        },
        upvotes: 45,
        downvotes: 2,
        dateAdded: "2024-03-15"
      },
      {
        id: "r2",
        name: "Practice Problems Set",
        type: "Exercises",
        url: "https://drive.google.com/example2",
        contributor: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 32,
        downvotes: 5,
        dateAdded: "2024-03-10"
      }
    ],
    comments: [
      {
        id: "c1",
        text: "Great introductory course! The professor explains concepts very clearly.",
        author: {
          name: "Alice Johnson",
          isAnonymous: false
        },
        upvotes: 25,
        downvotes: 1,
        datePosted: "2024-03-01"
      },
      {
        id: "c2",
        text: "Challenging but rewarding. Make sure to start assignments early.",
        author: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 18,
        downvotes: 2,
        datePosted: "2024-02-28"
      }
    ]
  },
  {
    course_id: "5",
    name: "Introduction to Materials",
    code: "ME540",
    professor: "Dr. Sarah Johnson",
    department: "MSME",
    credits: 1,
    metrics: {
      contentToughness: {
        average: 6,
        distribution: [
          { value: 1, count: 2 },
          { value: 2, count: 5 },
          { value: 3, count: 8 },
          { value: 4, count: 15 },
          { value: 5, count: 20 },
          { value: 6, count: 25 },
          { value: 7, count: 18 },
          { value: 8, count: 12 },
          { value: 9, count: 6 },
          { value: 10, count: 3 }
        ]
      },
      workload: {
        average: 7,
        distribution: [
          { value: 1, count: 1 },
          { value: 2, count: 3 },
          { value: 3, count: 7 },
          { value: 4, count: 12 },
          { value: 5, count: 18 },
          { value: 6, count: 22 },
          { value: 7, count: 25 },
          { value: 8, count: 15 },
          { value: 9, count: 8 },
          { value: 10, count: 4 }
        ]
      },
      overallRecommendation: {
        recommended: 85,
        notRecommended: 15
      }
    },
    resources: [
      {
        id: "r1",
        name: "Lecture Notes - Week 1-5",
        type: "Notes",
        url: "https://drive.google.com/example1",
        contributor: {
          name: "John Smith",
          isAnonymous: false
        },
        upvotes: 45,
        downvotes: 2,
        dateAdded: "2024-03-15"
      },
      {
        id: "r2",
        name: "Practice Problems Set",
        type: "Exercises",
        url: "https://drive.google.com/example2",
        contributor: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 32,
        downvotes: 5,
        dateAdded: "2024-03-10"
      }
    ],
    comments: [
      {
        id: "c1",
        text: "Great introductory course! The professor explains concepts very clearly.",
        author: {
          name: "Alice Johnson",
          isAnonymous: false
        },
        upvotes: 25,
        downvotes: 1,
        datePosted: "2024-03-01"
      },
      {
        id: "c2",
        text: "Challenging but rewarding. Make sure to start assignments early.",
        author: {
          name: "Anonymous",
          isAnonymous: true
        },
        upvotes: 18,
        downvotes: 2,
        datePosted: "2024-02-28"
      }
    ]
  }
  // Add similar data structure for other courses
];