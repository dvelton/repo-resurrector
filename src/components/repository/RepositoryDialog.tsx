import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Repository } from "@/types";
import { calculateTimeAgo, formatDate, getStalenessColor } from "@/lib/utils";
import { Link } from "@/components/ui/navigational";
import { useRepositories } from "@/contexts/RepositoryContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  GitBranch,
  GitPullRequest,
  GitMerge,
  Star,
  Calendar,
  Bug,
  GitFork,
  Check,
  Info,
  ListBullets,
  Code,
  Lightning
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface RepositoryDialogProps {
  repository: Repository | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RepositoryDialog({ repository, open, onOpenChange }: RepositoryDialogProps) {
  const { adoptRepository, generateAiSuggestions } = useRepositories();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (repository && open) {
      generateAiSuggestions(repository);
    }
  }, [repository, open, generateAiSuggestions]);

  if (!repository) {
    return null;
  }

  const {
    name,
    fullName,
    description,
    htmlUrl,
    stars,
    forks,
    openIssues,
    openPullRequests,
    lastCommitDate,
    topics,
    language,
    staleness,
    aiSummary,
    aiSuggestions,
    isAdopted
  } = repository;

  const handleAdopt = () => {
    adoptRepository(repository);
  };

  const stalenessColorClass = getStalenessColor(staleness.score);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start gap-2">
            <DialogTitle className="text-xl">{name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${stalenessColorClass}`}
              >
                <Calendar size={14} />
                <span>{calculateTimeAgo(lastCommitDate)}</span>
              </Badge>
            </div>
          </div>
          <DialogDescription>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">{fullName}</span>
              {language && (
                <Badge variant="secondary" className="text-xs">
                  {language}
                </Badge>
              )}
            </div>
            <p className="text-sm">{description}</p>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info size={16} />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Lightning size={16} />
              <span>AI Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <ListBullets size={16} />
              <span>Issues</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Repository</span>
                <Link href={htmlUrl} external className="text-sm hover:underline flex items-center gap-1">
                  <Code size={16} />
                  <span>{fullName}</span>
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm">{formatDate(lastCommitDate)}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <Star size={16} className="text-yellow-500" />
                  <span className="font-medium">{stars}</span>
                </div>
                <span className="text-xs text-muted-foreground">Stars</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <GitFork size={16} className="text-blue-500" />
                  <span className="font-medium">{forks}</span>
                </div>
                <span className="text-xs text-muted-foreground">Forks</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <Bug size={16} className="text-red-500" />
                  <span className="font-medium">{openIssues}</span>
                </div>
                <span className="text-xs text-muted-foreground">Issues</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1">
                  <GitPullRequest size={16} className="text-purple-500" />
                  <span className="font-medium">{openPullRequests}</span>
                </div>
                <span className="text-xs text-muted-foreground">PRs</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Staleness Score</h4>
              <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                <div 
                  className={`h-2.5 rounded-full ${
                    staleness.score >= 90 ? 'bg-red-600' :
                    staleness.score >= 70 ? 'bg-amber-600' :
                    staleness.score >= 50 ? 'bg-yellow-600' :
                    staleness.score >= 30 ? 'bg-green-600' : 'bg-green-400'
                  }`}
                  style={{ width: `${staleness.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Active</span>
                <span>{staleness.score}/100</span>
                <span>Stale</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                  </Badge>
                ))}
                {topics.length === 0 && (
                  <span className="text-sm text-muted-foreground">No topics</span>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">AI Summary</h4>
              <p className="text-sm">{aiSummary || "Generating summary..."}</p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Improvements</h4>
              {aiSuggestions ? (
                <ul className="list-disc list-inside space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm">{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generating suggestions...
                </p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Adoption Strategy</h4>
              <p className="text-sm">
                When adopting this repository, we recommend the following approach:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li className="text-sm">Fork the repository to your GitHub account</li>
                <li className="text-sm">Create an issue in the original repository expressing your interest in maintaining</li>
                <li className="text-sm">Update dependencies and address security vulnerabilities</li>
                <li className="text-sm">Implement the suggested improvements</li>
                <li className="text-sm">Submit pull requests to the original repository</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="issues" className="py-4">
            <div className="rounded-lg border p-4 text-center">
              <h4 className="font-medium mb-2">Open Issues</h4>
              <p className="text-muted-foreground text-sm mb-4">
                This repository has {openIssues} open issues that need attention.
              </p>
              <Button asChild variant="outline">
                <Link href={`${htmlUrl}/issues`} external>
                  View Issues on GitHub
                </Link>
              </Button>
            </div>
            
            <div className="rounded-lg border p-4 text-center mt-4">
              <h4 className="font-medium mb-2">Pull Requests</h4>
              <p className="text-muted-foreground text-sm mb-4">
                This repository has {openPullRequests} open pull requests waiting to be reviewed.
              </p>
              <Button asChild variant="outline">
                <Link href={`${htmlUrl}/pulls`} external>
                  View Pull Requests on GitHub
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex w-full gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href={htmlUrl} external>
                View on GitHub
              </Link>
            </Button>
            {isAdopted ? (
              <Button variant="secondary" disabled className="flex-1 gap-2">
                <Check size={16} weight="bold" />
                <span>Adopted</span>
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleAdopt}
                disabled={!user}
                className="flex-1 gap-2"
              >
                <GitMerge size={16} />
                <span>Adopt Repository</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}