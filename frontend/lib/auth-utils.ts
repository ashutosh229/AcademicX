import { Student } from "../types/types";

// Function to determine if a user is a student based on email domain
export function isInstitutionalEmail(email: string): boolean {
  return email.endsWith('@iitbhilai.ac.in');
}

export function getUserRole(email: string): 'student' | 'viewer' {
  return isInstitutionalEmail(email) ? 'student' : 'viewer';
}

// Function to check if the email is an authorized student email
export function isAuthorizedStudent(email: string): boolean {
  return isInstitutionalEmail(email);
}

export function getUserByEmail(email: string, session: any, students: Student[]) {
  try {
    const student = students.find((student) => {
      return student.email === email;
    });
    if (!student) {
      return {
        email: session?.user.email?.toString(),
        role: "viewer",
      };
    }
    return student;
  } catch (error: any) {
    console.log(error);
    // dispatch(setError(error.message));
    return {
      error: error.message,
    };
  }
};



// export interface Badge {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   dateEarned: string;
// }



// Dummy student data - this would come from a database in production
// export const authorizedStudents: User[] = [
//   {
//     id: '1',
//     email: 'student1@iitbhilai.ac.in',
//     name: 'John Doe',
//     role: 'student',
//     batch: '2023',
//     branch: 'Computer Science',
//     stats: {
//       totalContributions: 15,
//       totalUpvotes: 45,
//       totalDownvotes: 3,
//       badges: [
//         {
//           id: 'b1',
//           name: 'Early Contributor',
//           description: 'One of the first to contribute to the platform',
//           icon: 'Star',
//           dateEarned: '2024-01-15'
//         },
//         {
//           id: 'b2',
//           name: 'Resource Maven',
//           description: 'Shared 10+ high-quality resources',
//           icon: 'Trophy',
//           dateEarned: '2024-02-20'
//         }
//       ]
//     }
//   },
//   {
//     id: '2',
//     email: 'student2@iitbhilai.ac.in',
//     name: 'Jane Smith',
//     role: 'student',
//     batch: '2024',
//     branch: 'Electrical Engineering',
//     stats: {
//       totalContributions: 8,
//       totalUpvotes: 27,
//       totalDownvotes: 1,
//       badges: [
//         {
//           id: 'b1',
//           name: 'Helpful Reviewer',
//           description: 'Provided valuable feedback on multiple courses',
//           icon: 'ThumbsUp',
//           dateEarned: '2024-02-10'
//         }
//       ]
//     }
//   },
// ];

// // Function to get user by email
// export function getUserByEmail(email: string): User | null {
//   // First check if it's an existing student
//   const student = authorizedStudents.find(s => s.email === email);
//   if (student) return student;

//   // If not found but has institutional email, create a new student
//   if (isInstitutionalEmail(email)) {
//     return {
//       id: `student-${Date.now()}`,
//       email,
//       name: email.split('@')[0], // Use part before @ as name
//       role: 'student'
//     };
//   }

//   // For viewers, create a new user object
//   return {
//     id: `viewer-${Date.now()}`,
//     email,
//     name: email.split('@')[0], // Use part before @ as name
//     role: 'viewer'
//   };
// }




// // Function to update user profile
// export function updateUserProfile(id: string, updates: Partial<User>): User | null {
//   const userIndex = authorizedStudents.findIndex(user => user.id === id);
//   if (userIndex === -1) return null;

//   const updatedUser = {
//     ...authorizedStudents[userIndex],
//     ...updates
//   };
//   authorizedStudents[userIndex] = updatedUser;
//   return updatedUser;
// }