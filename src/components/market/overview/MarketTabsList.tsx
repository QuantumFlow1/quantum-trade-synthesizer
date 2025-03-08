
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketTabsListProps {
  marketOrder: string[];
  groupedData: Record<string, any[]>;
}

export const MarketTabsList = ({ marketOrder, groupedData }: MarketTabsListProps) => {
  return (
    <TabsList className="mb-6 bg-background/50 backdrop-blur-md relative flex flex-wrap gap-1">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
      {marketOrder.map((market) => (
        groupedData[market]?.length > 0 && (
          <TabsTrigger 
            key={market}
            value={market} 
            className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
          >
            {market}
          </TabsTrigger>
        )
      ))}
    </TabsList>
  );
};
