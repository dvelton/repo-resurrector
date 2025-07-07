import { useState } from "react";
import { useRepositories } from "@/contexts/RepositoryContext";
import { useAuth } from "@/contexts/AuthContext";
import { RepositoryCard } from "@/components/repository/RepositoryCard";
import { RepositoryDialog } from "@/components/repository/RepositoryDialog";
import { Button } from "@/components/ui/button";
import { Repository } from "@/types";
import { formatDate } from "@/lib/utils";
import { GitMerge } from "@phosphor-icons/react";
import { Link } from "@/components/ui/navigational";

export function AdoptedPage() {
  const { user } = useAuth();
  const { adoptedRepos } = useRepositories();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSelectRepository = (repo: Repository) => {
    setSelectedRepo(repo);
    setDialogOpen(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in to see your adoptions</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You need to sign in with your GitHub account to view and manage your adopted repositories.
        </p>
        <Button asChild>
          <Link href="/explore" className="gap-2">
            <GitMerge size={20} />
            <span>Explore Repositories</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Filter repositories adopted by the current user
  const myAdoptedRepos = adoptedRepos.filter(
    (repo) => repo.adoptedBy === user.login
  );

  if (myAdoptedRepos.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Adoptions</h1>
          <p className="text-muted-foreground">
            Repositories you have adopted to help maintain and revive.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <h2 className="text-xl font-medium mb-4">You haven't adopted any repositories yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by exploring abandoned repositories and adopt ones that interest you.
          </p>
          <Button asChild>
            <Link href="/explore" className="gap-2">
              <GitMerge size={20} />
              <span>Find Repositories</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Adoptions</h1>
        <p className="text-muted-foreground">
          Repositories you have adopted to help maintain and revive.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">
          {myAdoptedRepos.length} {myAdoptedRepos.length === 1 ? 'Repository' : 'Repositories'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myAdoptedRepos.map((repo) => (
          <div key={repo.id} className="flex flex-col">
            <div className="bg-accent/10 p-3 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <GitMerge size={16} className="text-accent" />
                <span className="text-sm font-medium">
                  Adopted on {formatDate(repo.adoptedAt)}
                </span>
              </div>
              <Badge variant={
                repo.status === 'revived' ? 'secondary' :
                repo.status === 'in_progress' ? 'default' : 'outline'
              }>
                {repo.status === 'revived' ? 'Revived' :
                 repo.status === 'in_progress' ? 'In Progress' : 'Adopted'}
              </Badge>
            </div>
            <div className="flex-1">
              <RepositoryCard
                repository={repo}
                onSelect={handleSelectRepository}
              />
            </div>
          </div>
        ))}
      </div>
      
      <RepositoryDialog
        repository={selectedRepo}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

// Import at the top was missing
import { Badge } from "@/components/ui/badge";