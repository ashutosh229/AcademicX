'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, getUserByEmail, isInstitutionalEmail } from './auth-utils';

// Define the type for the authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to provide authentication context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('academicx-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('academicx-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Function to log in a user
  const login = async (email: string): Promise<boolean> => {
    if (!email) return false;

    try {
      const user = await getUserByEmail(email);
      if (user) {
        setUser(user);
        localStorage.setItem('academicx-user', JSON.stringify(user));
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return false;
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('academicx-user');
  };

  // Function to update user profile
  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('academicx-user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  return (
    <AuthContext.Provider value= {{ user, isLoading, login, logout, updateProfile }
}>
  { children }
  </AuthContext.Provider>
  );
}

// Function to check if the email is an authorized student email
export function isAuthorizedStudent(email: string): boolean {
  return isInstitutionalEmail(email);
}
