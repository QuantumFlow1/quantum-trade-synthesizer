
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketData } from './types';
import { MarketDetailHeader } from './detail/MarketDetailHeader';
import { MarketPriceOverview } from './detail/MarketPriceOverview';
import { MarketPriceChart } from './detail/MarketPriceChart';
import { MarketStatistics } from './detail/MarketStatistics';
import { MarketActions } from './detail/MarketActions';

interface EnhancedMarketDetailProps {
  marketData: MarketData;
  onClose: () => void;
}

export const EnhancedMarketDetail: React.FC<EnhancedMarketDetailProps> = ({
  marketData,
  onClose
}) => {
  return (
    <Card className="w-full shadow-md">
      <MarketDetailHeader marketData={marketData} onClose={onClose} />
      
      <CardContent className="pb-6">
        <MarketPriceOverview marketData={marketData} />
        <MarketPriceChart marketData={marketData} />
        <MarketStatistics marketData={marketData} />
        <MarketActions />
      </CardContent>
    </Card>
  );
};
