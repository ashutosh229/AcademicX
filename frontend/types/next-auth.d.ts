import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  role?: "student" | "viewer";
}

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export interface User {
  email?: string | null;
  name?: string | null;
  batch?: string | null;
  degree?: string | null;
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