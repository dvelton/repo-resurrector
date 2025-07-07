import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { User } from "../types";
import { useKV } from "@github/spark/hooks";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser, deleteUser] = useKV<User | null>("auth-user", null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user data is available via Spark API
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (!user) {
          const sparkUser = await spark.user();
          if (sparkUser && sparkUser.login) {
            // We have a GitHub user from Spark, create our internal user object
            const appUser: User = {
              id: parseInt(sparkUser.id),
              login: sparkUser.login,
              avatarUrl: sparkUser.avatarUrl,
              url: `https://github.com/${sparkUser.login}`
            };
            setUser(appUser);
          }
        }
      } catch (err) {
        console.error("Failed to check user status:", err);
      }
    };

    checkUserStatus();
    // Remove 'user' from dependency array to prevent infinite loop
    // since checking for !user and then calling setUser creates a loop
  }, [setUser]);

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would redirect to GitHub OAuth
      // For the demo, we'll simulate with the Spark user API
      const sparkUser = await spark.user();
      if (sparkUser && sparkUser.login) {
        const appUser: User = {
          id: parseInt(sparkUser.id),
          login: sparkUser.login,
          avatarUrl: sparkUser.avatarUrl,
          url: `https://github.com/${sparkUser.login}`
        };
        setUser(appUser);
      } else {
        throw new Error("Failed to get user information");
      }
    } catch (err) {
      setError((err as Error).message || "Authentication failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    deleteUser();
    setIsLoading(false);
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};