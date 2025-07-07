import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeaderboardEntry } from "@/types";
import { Link } from "@/components/ui/navigational";
import { Trophy, GitMerge, Star } from "@phosphor-icons/react";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({ entries, isLoading = false }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <h3 className="font-medium text-lg mb-2">No entries yet</h3>
        <p className="text-muted-foreground">
          Be the first to adopt and revive a repository!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-center">Adoptions</TableHead>
            <TableHead className="text-center">Revivals</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={entry.user.login}>
              <TableCell className="font-medium">
                {index < 3 ? (
                  <Badge
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-yellow-500 hover:bg-yellow-500/90"
                        : index === 1
                        ? "bg-gray-400 hover:bg-gray-400/90"
                        : "bg-amber-700 hover:bg-amber-700/90"
                    }`}
                  >
                    <Trophy size={16} weight="fill" />
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">{index + 1}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.user.avatarUrl} alt={entry.user.login} />
                    <AvatarFallback>
                      {entry.user.login.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={entry.user.url}
                      external
                      className="font-medium hover:underline"
                    >
                      {entry.user.login}
                    </Link>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-1">
                  <GitMerge size={16} className="text-primary" />
                  <span>{entry.adoptsCount}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-1">
                  <Star size={16} className="text-secondary" />
                  <span>{entry.revivalsCount}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {entry.score} points
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}