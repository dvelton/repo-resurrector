import { useState, useEffect } from "react";
import { useRepositories } from "@/contexts/RepositoryContext";
import { SearchFilters } from "@/components/repository/SearchFilters";
import { RepositoryCard } from "@/components/repository/RepositoryCard";
import { RepositoryDialog } from "@/components/repository/RepositoryDialog";
import { Button } from "@/components/ui/button";
import { Repository } from "@/types";

export function ExplorePage() {
  const { 
    repositories,
    isLoading, 
    error, 
    filters, 
    searchRepositories,
    loadMoreRepositories,
    hasMore,
    setFilters
  } = useRepositories();
  
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Load repositories on initial mount
  useEffect(() => {
    searchRepositories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleSelectRepository = (repo: Repository) => {
    setSelectedRepo(repo);
    setDialogOpen(true);
  };
  
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    searchRepositories(newFilters);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Discover Dead Repositories</h1>
        <p className="text-muted-foreground">
          Find abandoned but promising repositories that need your help to be revived.
        </p>
      </div>
      
      <SearchFilters
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
      
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive p-4 mb-6">
          <p className="text-destructive">Error: {error}</p>
        </div>
      )}
      
      {isLoading && repositories.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onSelect={handleSelectRepository}
              />
            ))}
          </div>
          
          {repositories.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <h3 className="font-medium text-lg mb-2">No repositories found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
          
          {hasMore && repositories.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => loadMoreRepositories()}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
      
      <RepositoryDialog
        repository={selectedRepo}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}