"use client";

import { setError, setLoading, setStudents } from "@/redux/slices/studentSlice";
import { RootState } from "@/redux/store";
import { AuthContextType, User } from "@/types/next-auth";
import { backendDomain } from "@/types/types";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getUserByEmail } from "./auth-utils";

// Create the authentication context
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to provide authentication context
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { students, loading, error } = useSelector(
    (state: RootState) => state.student
  );
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudets = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`${backendDomain}/get_all_students/`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Unable to fetch the students");
        }
        toast.success("Students fetched successfully");
        const data = await response.json();
        dispatch(setStudents(data));
      } catch (error: any) {
        console.log(error);
        toast.error("Unable to fetch the students");
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchStudets();
  }, [dispatch]);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("academicx-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("academicx-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Function to log in a user
  const login = async (email: string): Promise<boolean> => {
    if (!email) return false;

    try {
      const user = getUserByEmail(email, session, students);
      if (user && user.role === "viewer") {
        setUser(user as User);
        localStorage.setItem("academicx-user", JSON.stringify(user));
        return true;
      }
      if (user && user.role === "student") {
        setUser(user as User);
        localStorage.setItem("academicx-user", JSON.stringify(user));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("academicx-user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
