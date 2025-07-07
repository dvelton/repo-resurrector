export interface User {
  id: number;
  login: string;
  avatarUrl: string;
  name?: string;
  bio?: string;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  htmlUrl: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  stars: number;
  forks: number;
  openIssues: number;
  openPullRequests: number;
  lastCommitDate: string;
  topics: string[];
  language: string;
  staleness: {
    score: number;
    daysSinceLastCommit: number;
    dependencyFreshness?: number;
  };
  aiSummary?: string;
  aiSuggestions?: string[];
  isAdopted?: boolean;
}

export interface AdoptedRepository extends Repository {
  adoptedAt: string;
  adoptedBy: string;
  status: 'adopted' | 'in_progress' | 'revived';
  improvements?: string[];
}

export interface LeaderboardEntry {
  user: User;
  adoptsCount: number;
  revivalsCount: number;
  score: number;
}

export interface SearchFilters {
  language?: string;
  minStars?: number;
  minForks?: number;
  topics?: string[];
  sortBy?: 'staleness' | 'stars' | 'forks' | 'issues';
  sortDirection?: 'asc' | 'desc';
}