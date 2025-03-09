
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "../MarketCharts";

interface MarketTabsProps {
  groupedData: Record<string, any[]>;
  marketOrder: string[];
}

export const MarketTabs: React.FC<MarketTabsProps> = ({ 
  groupedData, 
  marketOrder 
}) => {
  return (
    <Tabs defaultValue={marketOrder.find(market => groupedData[market]?.length > 0) || marketOrder[0]} className="w-full">
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

      <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
        {marketOrder.map((market) => (
          groupedData[market]?.length > 0 && (
            <TabsContent 
              key={market}
              value={market} 
              className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
            >
              <MarketCharts 
                data={groupedData[market] || []} 
                isLoading={false} 
                type="overview" 
              />
            </TabsContent>
          )
        ))}
      </div>
    </Tabs>
  );
};
