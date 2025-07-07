import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repository } from "@/types";
import { calculateTimeAgo, getStalenessColor, truncateText } from "@/lib/utils";
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
  Check
} from "@phosphor-icons/react";

interface RepositoryCardProps {
  repository: Repository;
  onSelect: (repo: Repository) => void;
}

export function RepositoryCard({ repository, onSelect }: RepositoryCardProps) {
  const { adoptRepository } = useRepositories();
  const { user } = useAuth();
  
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
    isAdopted
  } = repository;

  const handleAdopt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    adoptRepository(repository);
  };

  const handleSelect = () => {
    onSelect(repository);
  };

  const stalenessColorClass = getStalenessColor(staleness.score);

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-lg">
              <Link href={htmlUrl} external className="hover:underline">
                {name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">{fullName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${stalenessColorClass}`}
            >
              <Calendar size={14} />
              <span>{calculateTimeAgo(lastCommitDate)}</span>
            </Badge>
            {language && (
              <Badge variant="secondary" className="text-xs">
                {language}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-2">
        <p className="text-sm text-muted-foreground mb-4">
          {truncateText(description, 120)}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {topics.slice(0, 4).map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
          {topics.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{topics.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star size={16} />
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch size={16} />
            <span>{forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bug size={16} />
            <span>{openIssues}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitPullRequest size={16} />
            <span>{openPullRequests}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {isAdopted ? (
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            disabled
          >
            <Check size={16} weight="bold" />
            <span>Adopted</span>
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full gap-2" 
            onClick={handleAdopt}
            disabled={!user}
          >
            <GitMerge size={16} />
            <span>Adopt Repository</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}