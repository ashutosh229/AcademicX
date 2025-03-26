import "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  role?: "student" | "viewer";
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      batch?: string | null;
      branch?: string | null;
      activated?: boolean | null
      role?: 'student' | 'viewer';
    };
  }

  // interface User {
  //   role?: 'student' | 'viewer';
  // }
}

export interface User {
  email?: string | null;
  name?: string | null;
  batch?: string | null;
  branch?: string | null;
  activated?: booleam | null;
  role?: 'student' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}