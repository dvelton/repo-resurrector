import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchFilters as SearchFiltersType } from "@/types";
import { MagnifyingGlass, SlidersHorizontal, X, Check } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const POPULAR_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C#",
  "Ruby",
  "PHP",
  "Swift"
];

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onApplyFilters: (filters: SearchFiltersType) => void;
}

export function SearchFilters({ filters, onApplyFilters }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters);
  
  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      sortBy: 'staleness',
      sortDirection: 'desc',
      minStars: 50
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    setIsOpen(false);
  };
  
  // Count non-default filters
  const countActiveFilters = () => {
    let count = 0;
    if (localFilters.language) count++;
    if (localFilters.minStars && localFilters.minStars !== 50) count++;
    if (localFilters.minForks) count++;
    if (localFilters.topics && localFilters.topics.length > 0) count++;
    if (localFilters.sortBy && localFilters.sortBy !== 'staleness') count++;
    return count;
  };
  
  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search repositories..." 
            className="pl-10" 
            // Search functionality would be implemented in a real application
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-10">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {countActiveFilters() > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
                  {countActiveFilters()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Repository Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Filter repositories that match your criteria.
                </p>
              </div>
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select
                  value={localFilters.language || ""}
                  onValueChange={(value) => handleFilterChange('language', value || undefined)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Any language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Any language</SelectItem>
                      {POPULAR_LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="minStars">Minimum Stars</Label>
                <Select
                  value={String(localFilters.minStars || 50)}
                  onValueChange={(value) => handleFilterChange('minStars', parseInt(value))}
                >
                  <SelectTrigger id="minStars">
                    <SelectValue placeholder="50+ stars" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="50">50+ stars</SelectItem>
                      <SelectItem value="100">100+ stars</SelectItem>
                      <SelectItem value="500">500+ stars</SelectItem>
                      <SelectItem value="1000">1000+ stars</SelectItem>
                      <SelectItem value="5000">5000+ stars</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="minForks">Minimum Forks</Label>
                <Select
                  value={String(localFilters.minForks || "")}
                  onValueChange={(value) => handleFilterChange('minForks', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger id="minForks">
                    <SelectValue placeholder="Any number of forks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Any number of forks</SelectItem>
                      <SelectItem value="5">5+ forks</SelectItem>
                      <SelectItem value="10">10+ forks</SelectItem>
                      <SelectItem value="50">50+ forks</SelectItem>
                      <SelectItem value="100">100+ forks</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={localFilters.sortBy || "staleness"}
                  onValueChange={(value) => handleFilterChange('sortBy', value as any)}
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Staleness Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="staleness">Staleness Score</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="forks">Forks</SelectItem>
                      <SelectItem value="issues">Open Issues</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sortDirection">Sort Direction</Label>
                <Select
                  value={localFilters.sortDirection || "desc"}
                  onValueChange={(value) => handleFilterChange('sortDirection', value as any)}
                >
                  <SelectTrigger id="sortDirection">
                    <SelectValue placeholder="Descending" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="gap-2">
                  <X size={16} />
                  <span>Reset</span>
                </Button>
                <Button size="sm" onClick={handleApplyFilters} className="gap-2">
                  <Check size={16} />
                  <span>Apply Filters</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Select
          value={filters.sortBy || "staleness"}
          onValueChange={(value) => onApplyFilters({ ...filters, sortBy: value as any })}
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="staleness">Staleness Score</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="forks">Forks</SelectItem>
              <SelectItem value="issues">Open Issues</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}