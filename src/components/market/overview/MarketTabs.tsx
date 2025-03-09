
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "../MarketCharts";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketTabsProps {
  groupedData: Record<string, any[]>;
  marketOrder: string[];
  isLoading?: boolean;
}

export const MarketTabs: React.FC<MarketTabsProps> = ({ 
  groupedData, 
  marketOrder,
  isLoading = false
}) => {
  // Get the first market that has data as default tab
  const defaultMarket = marketOrder.find(market => 
    groupedData[market] && Array.isArray(groupedData[market]) && groupedData[market].length > 0
  ) || marketOrder[0];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-background/50 backdrop-blur-md relative flex flex-wrap gap-1 p-1 rounded-md">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  // Check if we have any data at all
  const hasAnyData = marketOrder.some(market => 
    groupedData[market] && Array.isArray(groupedData[market]) && groupedData[market].length > 0
  );

  if (!hasAnyData) {
    return (
      <div className="p-8 text-center border rounded-lg border-dashed border-muted-foreground/50">
        <h3 className="text-lg font-medium mb-2">No Market Data Available</h3>
        <p className="text-muted-foreground">
          Market data could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={defaultMarket} className="w-full">
      <TabsList className="mb-6 bg-background/50 backdrop-blur-md relative flex flex-wrap gap-1">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
        {marketOrder.map((market) => (
          (groupedData[market] && Array.isArray(groupedData[market]) && groupedData[market].length > 0) && (
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

      <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
        {marketOrder.map((market) => (
          (groupedData[market] && Array.isArray(groupedData[market]) && groupedData[market].length > 0) && (
            <TabsContent 
              key={market}
              value={market} 
              className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
            >
              <MarketCharts 
                data={groupedData[market] || []} 
                isLoading={isLoading} 
                type="overview" 
              />
            </TabsContent>
          )
        ))}
      </div>
    </Tabs>
  );
};
