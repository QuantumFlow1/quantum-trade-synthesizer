
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketDetailHeader } from './detail/MarketDetailHeader';
import { MarketPriceOverview } from './detail/MarketPriceOverview';
import { MarketPriceChart } from './detail/MarketPriceChart';
import { MarketStatistics } from './detail/MarketStatistics';
import { MarketActions } from './detail/MarketActions';
import { AIMarketAnalysis } from './AIMarketAnalysis';
import { MarketData } from './types';
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, BrainCircuit } from "lucide-react";

interface EnhancedMarketDetailProps {
  marketData: MarketData;
  onClose: () => void;
}

export const EnhancedMarketDetail = ({ marketData, onClose }: EnhancedMarketDetailProps) => {
  const isMobile = useIsMobile();
  const [expandedSections, setExpandedSections] = useState({
    priceOverview: true,
    chartSection: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className="bg-card overflow-hidden border-0">
      <MarketDetailHeader marketData={marketData} onClose={onClose} />
      
      <CardContent className={`p-4 ${isMobile ? 'p-2' : 'p-6'}`}>
        {/* Price Overview Section - Expandable */}
        <Collapsible
          open={expandedSections.priceOverview}
          onOpenChange={() => toggleSection('priceOverview')}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Price Overview</h3>
            <CollapsibleTrigger className="p-1 hover:bg-secondary/20 rounded-full">
              {expandedSections.priceOverview ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-2">
            <MarketPriceOverview marketData={marketData} />
          </CollapsibleContent>
        </Collapsible>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="chart" className="mt-4">
          <TabsList className={`mb-4 ${isMobile ? 'w-full grid grid-cols-4' : ''}`}>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="ai-analysis">
              <BrainCircuit className="h-4 w-4 mr-1.5" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="actions">Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-2">
            <Collapsible
              open={expandedSections.chartSection}
              onOpenChange={() => toggleSection('chartSection')}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Price History</h3>
                <CollapsibleTrigger className="p-1 hover:bg-secondary/20 rounded-full">
                  {expandedSections.chartSection ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <Card className="bg-card/50">
                  <CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
                    <MarketPriceChart marketData={marketData} />
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-2">
            <Card className="bg-card/50">
              <CardContent className={`${isMobile ? 'p-2' : 'p-4'}`}>
                <MarketStatistics marketData={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-analysis" className="mt-2">
            <Card className="bg-card/50">
              <CardContent className={`${isMobile ? 'p-2' : 'p-4'} h-[400px]`}>
                <AIMarketAnalysis marketData={marketData} />
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
      </CardContent>
    </Card>
  );
};
