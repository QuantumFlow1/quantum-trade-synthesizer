
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, BarChart } from 'lucide-react';
import { MarketData } from '@/components/market/types';
import { MarketCharts } from '@/components/market/MarketCharts';

interface MarketTrendCardsProps {
  marketData: MarketData[];
  isLoading: boolean;
}

export const MarketTrendCards: React.FC<MarketTrendCardsProps> = ({ 
  marketData,
  isLoading
}) => {
  const getTopPerformers = (): MarketData[] => {
    return [...marketData]
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
      .slice(0, 5);
  };
  
  const getTopVolume = (): MarketData[] => {
    return [...marketData]
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 5);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Top Performers (24h)
          </h2>
          <MarketCharts data={getTopPerformers()} isLoading={isLoading} type="price" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            Top Volume (24h)
          </h2>
          <MarketCharts data={getTopVolume()} isLoading={isLoading} type="volume" />
        </CardContent>
      </Card>
    </div>
  );
};
