
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketFiltersProps {
  selectedMarket: string;
  onMarketChange: (value: string) => void;
  sortDirection: "asc" | "desc";
  onSortDirectionToggle: () => void;
  uniqueMarkets: string[];
}

export const MarketFilters = ({
  selectedMarket,
  onMarketChange,
  sortDirection,
  onSortDirectionToggle,
  uniqueMarkets,
}: MarketFiltersProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Real-time market data fetched from API.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Select value={selectedMarket} onValueChange={onMarketChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Markets</SelectItem>
            {uniqueMarkets.map((market) => (
              <SelectItem key={market} value={market}>
                {market}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={onSortDirectionToggle}
          className="flex items-center gap-1"
        >
          <ArrowDownUp className="h-4 w-4" />
          <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
        </Button>
      </div>
    </div>
  );
};
