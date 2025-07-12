import { createContext, useContext, useState, ReactNode } from "react";
import { authApi } from "../lib/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  profilePicture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in (stored in localStorage)
    return localStorage.getItem("authToken") !== null;
  });

  const [user, setUser] = useState<User | null>(() => {
    // Load user data from localStorage if available
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);

      // Validate response structure
      if (!response.token || !response.user) {
        throw new Error(
          "Invalid response from server: missing token or user data",
        );
      }

      // Store auth token
      localStorage.setItem("authToken", response.token);

      // Store user data with proper mapping
      const userData = {
        id: response.user.id,
        fullName: response.user.fullName || response.user.name,
        email: response.user.email,
        location: response.user.location,
        skillsOffered:
          response.user.skillsOffered || response.user.offered_skills || [],
        skillsWanted:
          response.user.skillsWanted || response.user.wanted_skills || [],
        availability: response.user.availability || [],
        profilePicture:
          response.user.profilePicture || response.user.profile_pic_url,
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
