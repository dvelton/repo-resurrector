import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { LeaderboardEntry } from "../types";
import { useRepositories } from "./RepositoryContext";

interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

interface LeaderboardProviderProps {
  children: ReactNode;
}

export function LeaderboardProvider({ children }: LeaderboardProviderProps) {
  const { adoptedRepos } = useRepositories();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateLeaderboard = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Group adopted repos by user
      const userMap = new Map<string, LeaderboardEntry>();
      
      adoptedRepos.forEach(repo => {
        const username = repo.adoptedBy;
        if (!userMap.has(username)) {
          userMap.set(username, {
            user: {
              id: 0, // We don't have this info in the mock data
              login: username,
              avatarUrl: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 1000000)}`,
              url: `https://github.com/${username}`
            },
            adoptsCount: 0,
            revivalsCount: 0,
            score: 0
          });
        }
        
        const entry = userMap.get(username)!;
        entry.adoptsCount += 1;
        
        if (repo.status === 'revived') {
          entry.revivalsCount += 1;
        }
        
        // Calculate score: 10 points per adoption, 50 points per revival
        entry.score = entry.adoptsCount * 10 + entry.revivalsCount * 50;
      });
      
      // Convert map to array and sort by score
      const entries = Array.from(userMap.values()).sort((a, b) => b.score - a.score);
      setLeaderboard(entries);
    } catch (err) {
      setError((err as Error).message || "Failed to calculate leaderboard");
      console.error("Leaderboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate leaderboard when adopted repos change
  useEffect(() => {
    calculateLeaderboard();
  }, [adoptedRepos]);

  const value = {
    leaderboard,
    isLoading,
    error,
    refresh: calculateLeaderboard
  };

  return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>;
}

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};