import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Repository } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d)
}

export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  // Less than a minute
  if (secondsAgo < 60) return `${secondsAgo} seconds ago`
  
  // Less than an hour
  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`
  
  // Less than a day
  const hoursAgo = Math.floor(minutesAgo / 60)
  if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
  
  // Less than a month
  const daysAgo = Math.floor(hoursAgo / 24)
  if (daysAgo < 30) return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`
  
  // Less than a year
  const monthsAgo = Math.floor(daysAgo / 30)
  if (monthsAgo < 12) return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`
  
  // Years
  const yearsAgo = Math.floor(monthsAgo / 12)
  return `${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago`
}

export function getStalenessColor(score: number): string {
  if (score >= 90) return 'text-red-600'
  if (score >= 70) return 'text-amber-600'
  if (score >= 50) return 'text-yellow-600'
  if (score >= 30) return 'text-green-600'
  return 'text-green-400'
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const mockRepositories: Repository[] = [
  {
    id: 1,
    name: "awesome-project",
    fullName: "developer/awesome-project",
    description: "A utility library for handling complex data structures with ease and performance",
    url: "https://api.github.com/repos/developer/awesome-project",
    htmlUrl: "https://github.com/developer/awesome-project",
    owner: {
      login: "developer",
      avatarUrl: "https://avatars.githubusercontent.com/u/12345678"
    },
    stars: 245,
    forks: 35,
    openIssues: 12,
    openPullRequests: 6,
    lastCommitDate: "2022-05-15T10:30:00Z",
    topics: ["javascript", "utilities", "performance"],
    language: "JavaScript",
    staleness: {
      score: 75,
      daysSinceLastCommit: 450,
      dependencyFreshness: 0.3
    },
    aiSummary: "A JavaScript utility library focused on efficiently manipulating complex data structures with a minimal footprint.",
    aiSuggestions: [
      "Update dependencies to address security vulnerabilities",
      "Migrate to TypeScript for better type safety",
      "Add more comprehensive test coverage"
    ]
  },
  {
    id: 2,
    name: "data-viz-framework",
    fullName: "viz-team/data-viz-framework",
    description: "A declarative framework for building interactive data visualizations",
    url: "https://api.github.com/repos/viz-team/data-viz-framework",
    htmlUrl: "https://github.com/viz-team/data-viz-framework",
    owner: {
      login: "viz-team",
      avatarUrl: "https://avatars.githubusercontent.com/u/87654321"
    },
    stars: 912,
    forks: 105,
    openIssues: 43,
    openPullRequests: 18,
    lastCommitDate: "2021-11-02T15:45:00Z",
    topics: ["visualization", "d3", "svg", "charts"],
    language: "TypeScript",
    staleness: {
      score: 88,
      daysSinceLastCommit: 650,
      dependencyFreshness: 0.1
    },
    aiSummary: "A TypeScript framework for building interactive data visualizations based on D3, with a declarative API.",
    aiSuggestions: [
      "Update D3 dependency to latest version",
      "Implement React integration",
      "Add support for modern browser features like Web Components"
    ]
  },
  {
    id: 3,
    name: "ml-toolkit",
    fullName: "ai-lab/ml-toolkit",
    description: "A collection of machine learning algorithms and utilities for data preprocessing",
    url: "https://api.github.com/repos/ai-lab/ml-toolkit",
    htmlUrl: "https://github.com/ai-lab/ml-toolkit",
    owner: {
      login: "ai-lab",
      avatarUrl: "https://avatars.githubusercontent.com/u/55555555"
    },
    stars: 1250,
    forks: 320,
    openIssues: 67,
    openPullRequests: 28,
    lastCommitDate: "2022-03-11T09:15:00Z",
    topics: ["machine-learning", "data-science", "python", "algorithms"],
    language: "Python",
    staleness: {
      score: 70,
      daysSinceLastCommit: 520,
      dependencyFreshness: 0.4
    },
    aiSummary: "A Python toolkit providing implementations of common machine learning algorithms and data preprocessing utilities.",
    aiSuggestions: [
      "Update scikit-learn dependencies",
      "Add GPU acceleration support",
      "Implement newer algorithms from recent papers"
    ]
  }
]