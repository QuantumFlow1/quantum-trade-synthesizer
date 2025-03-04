
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketDetailHeader } from './detail/MarketDetailHeader';
import { MarketPriceOverview } from './detail/MarketPriceOverview';
import { MarketPriceChart } from './detail/MarketPriceChart';
import { MarketStatistics } from './detail/MarketStatistics';
import { MarketActions } from './detail/MarketActions';
import { MarketData } from './types';

interface EnhancedMarketDetailProps {
  marketData: MarketData;
  onClose: () => void;
}

export const EnhancedMarketDetail = ({ marketData, onClose }: EnhancedMarketDetailProps) => {
  return (
    <Card className="bg-card overflow-hidden border-0">
      <MarketDetailHeader marketData={marketData} onClose={onClose} />
      
      <CardContent className="p-6">
        <MarketPriceOverview marketData={marketData} />
        
        <Tabs defaultValue="chart" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="actions">Trade</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-2">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <MarketPriceChart marketData={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-2">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <MarketStatistics marketData={marketData} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="actions" className="mt-2">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <MarketActions marketData={marketData} onClose={onClose} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
