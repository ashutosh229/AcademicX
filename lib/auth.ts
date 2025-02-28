'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, getUserByEmail, isInstitutionalEmail } from './auth-utils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateProfile: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
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

  const login = async (email: string): Promise<boolean> => {
    // For student login, check if it's an institutional email
    if (!email) return false;
    
    const user = getUserByEmail(email);
    if (user) {
      setUser(user);
      localStorage.setItem('academicx-user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('academicx-user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<User | null> => {
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
    };
    
    setUser(updatedUser);
    localStorage.setItem('academicx-user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to check if email is an authorized student
export function isAuthorizedStudent(email: string): boolean {
  return isInstitutionalEmail(email);
}