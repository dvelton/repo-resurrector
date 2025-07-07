import { useLeaderboard } from "@/contexts/LeaderboardContext";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "@phosphor-icons/react";

export function LeaderboardPage() {
  const { leaderboard, isLoading, refresh } = useLeaderboard();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top contributors helping to resurrect abandoned open source repositories.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>

      <LeaderboardTable entries={leaderboard} isLoading={isLoading} />
      
      <div className="mt-8 p-6 rounded-lg bg-muted/30 border">
        <h2 className="text-xl font-semibold mb-4">How Scoring Works</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium">Adoption Points</h3>
              <p className="text-sm text-muted-foreground">
                Earn <strong>10 points</strong> for each repository you adopt and start working on.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium">Revival Points</h3>
              <p className="text-sm text-muted-foreground">
                Earn <strong>50 points</strong> for each repository that gets revived with your contributions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium">Rankings</h3>
              <p className="text-sm text-muted-foreground">
                Leaderboard rankings are updated in real-time as repositories are adopted and revived.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}