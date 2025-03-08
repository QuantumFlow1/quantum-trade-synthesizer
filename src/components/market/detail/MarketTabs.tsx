
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MarketPriceChart } from "./MarketPriceChart";
import { MarketStatistics } from "./MarketStatistics";
import { MarketActions } from "./MarketActions";
import { MarketData } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import { CollapsibleSection } from "./CollapsibleSection";

interface MarketTabsProps {
  marketData: MarketData;
  expandedSections: {
    chartSection: boolean;
  };
  toggleSection: (section: string) => void;
  onClose: () => void;
}

export const MarketTabs = ({ 
  marketData, 
  expandedSections, 
  toggleSection,
  onClose
}: MarketTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="chart" className="mt-4">
      <TabsList className={`mb-4 ${isMobile ? 'w-full grid grid-cols-3' : ''}`}>
        <TabsTrigger value="chart">Price Chart</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="actions">Trade</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="mt-2">
        <CollapsibleSection
          title="Price History"
          isExpanded={expandedSections.chartSection}
          onToggle={() => toggleSection('chartSection')}
        >
          <Card className="bg-card/50">
            <CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
              <MarketPriceChart marketData={marketData} />
            </CardContent>
          </Card>
        </CollapsibleSection>
      </TabsContent>
      
      <TabsContent value="statistics" className="mt-2">
        <Card className="bg-card/50">
          <CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
            <MarketStatistics marketData={marketData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="actions" className="mt-2">
        <Card className="bg-card/50">
          <CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
            <MarketActions marketData={marketData} onClose={onClose} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
