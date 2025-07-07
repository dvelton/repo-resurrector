import { createContext, useContext, ReactNode, useState } from "react";
import { Repository, SearchFilters, AdoptedRepository } from "../types";
import { mockRepositories } from "../lib/utils";
import { useKV } from "@github/spark/hooks";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface RepositoryContextType {
  repositories: Repository[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  adoptedRepos: AdoptedRepository[];
  searchRepositories: (newFilters?: SearchFilters) => Promise<void>;
  loadMoreRepositories: () => Promise<void>;
  adoptRepository: (repo: Repository) => Promise<void>;
  generateAiSuggestions: (repo: Repository) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  currentPage: number;
  hasMore: boolean;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);

interface RepositoryProviderProps {
  children: ReactNode;
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [adoptedRepos, setAdoptedRepos, ] = useKV<AdoptedRepository[]>("adopted-repositories", []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'staleness',
    sortDirection: 'desc',
    minStars: 50,
  });

  const searchRepositories = async (newFilters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Reset pagination when starting a new search
      setCurrentPage(1);
      
      // Update filters if provided
      if (newFilters) {
        setFilters(newFilters);
      }
      
      // In a real implementation, this would call the GitHub API
      // For the demo, we're using mock data
      // Simulate filtering based on the filters
      const filteredRepos = [...mockRepositories];
      
      // Mark repositories that have been adopted
      const updatedRepos = filteredRepos.map(repo => {
        const isAdopted = adoptedRepos.some(r => r.id === repo.id);
        return { ...repo, isAdopted };
      });
      
      setRepositories(updatedRepos);
      setHasMore(updatedRepos.length >= 10); // Assume there's more if we got a full page
    } catch (err) {
      setError((err as Error).message || "Failed to search repositories");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRepositories = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would load the next page from GitHub API
      // For the demo, we'll just simulate by adding duplicates with new IDs
      const nextPage = repositories.map((repo, index) => ({
        ...repo,
        id: repo.id + repositories.length + index,
        name: `${repo.name}-${currentPage + 1}`,
        fullName: `${repo.fullName}-${currentPage + 1}`
      }));
      
      setRepositories(prev => [...prev, ...nextPage]);
      setCurrentPage(prev => prev + 1);
      setHasMore(nextPage.length >= 10); // Assume there's more if we got a full page
    } catch (err) {
      setError((err as Error).message || "Failed to load more repositories");
      console.error("Load more error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const adoptRepository = async (repo: Repository) => {
    if (!user) {
      toast.error("You must be logged in to adopt a repository");
      return;
    }
    
    try {
      const now = new Date().toISOString();
      const newAdoptedRepo: AdoptedRepository = {
        ...repo,
        adoptedAt: now,
        adoptedBy: user.login,
        status: 'adopted'
      };
      
      setAdoptedRepos(prev => [...prev, newAdoptedRepo]);
      
      // Mark the repository as adopted in the list
      setRepositories(prev => 
        prev.map(r => r.id === repo.id ? { ...r, isAdopted: true } : r)
      );
      
      toast.success(`Successfully adopted ${repo.name}`);
    } catch (err) {
      toast.error(`Failed to adopt ${repo.name}`);
      console.error("Adoption error:", err);
    }
  };

  const generateAiSuggestions = async (repo: Repository) => {
    if (repo.aiSummary && repo.aiSuggestions) {
      // Already has suggestions
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real implementation, this would use the Spark LLM API
      // For the demo, we'll simulate with mock data after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRepo: Repository = {
        ...repo,
        aiSummary: repo.aiSummary || `A ${repo.language} library that provides ${repo.topics.join(", ")} functionality with a focus on developer experience and performance.`,
        aiSuggestions: repo.aiSuggestions || [
          `Update dependencies to latest versions to fix security vulnerabilities`,
          `Add more comprehensive test coverage, especially for edge cases`,
          `Migrate to newer language features available in ${repo.language}`,
          `Improve documentation with more examples and use cases`
        ]
      };
      
      setRepositories(prev => 
        prev.map(r => r.id === repo.id ? updatedRepo : r)
      );
    } catch (err) {
      toast.error(`Failed to generate AI suggestions for ${repo.name}`);
      console.error("AI suggestion error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    repositories,
    isLoading,
    error,
    filters,
    adoptedRepos,
    searchRepositories,
    loadMoreRepositories,
    adoptRepository,
    generateAiSuggestions,
    setFilters,
    currentPage,
    hasMore
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}

export const useRepositories = () => {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error("useRepositories must be used within a RepositoryProvider");
  }
  return context;
};