
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="bg-card">
      <MarketDetailHeader marketData={marketData} onClose={onClose} />
      
      <CardContent className="space-y-6">
        <MarketPriceOverview marketData={marketData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MarketPriceChart marketData={marketData} />
          </div>
          
          <div className="lg:col-span-1">
            <MarketActions marketData={marketData} onClose={onClose} />
          </div>
        </div>
        
        <MarketStatistics marketData={marketData} />
      </CardContent>
    </Card>
  );
};
