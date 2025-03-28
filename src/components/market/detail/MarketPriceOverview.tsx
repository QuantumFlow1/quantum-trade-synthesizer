
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketData } from '../types';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

interface MarketPriceOverviewProps {
  marketData: MarketData;
}

export const MarketPriceOverview: React.FC<MarketPriceOverviewProps> = ({ marketData }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col ${isMobile ? 'space-y-4' : 'md:flex-row justify-between'} mb-6`}>
      <div className="mb-4 md:mb-0">
        <div className="text-3xl font-bold">{formatCurrency(marketData.price)}</div>
        <div className={`flex items-center mt-1 ${
          (marketData.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {(marketData.change24h || 0) >= 0 ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span>{formatPercentage(marketData.change24h)}</span>
          <span className="text-muted-foreground text-sm ml-2">(24h)</span>
        </div>
      </div>
      
      <div className={`flex flex-wrap ${isMobile ? 'gap-2' : 'gap-4'}`}>
        <div className="bg-secondary/20 p-3 rounded-lg flex-1 min-w-[100px]">
          <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
          <div className="font-semibold">${formatLargeNumber(marketData.marketCap)}</div>
        </div>
        <div className="bg-secondary/20 p-3 rounded-lg flex-1 min-w-[100px]">
          <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
          <div className="font-semibold">${formatLargeNumber(marketData.volume || 0)}</div>
        </div>
        <div className="bg-secondary/20 p-3 rounded-lg flex-1 min-w-[100px]">
          <div className="text-xs text-muted-foreground mb-1">Supply</div>
          <div className="font-semibold">{formatLargeNumber(marketData.circulatingSupply || 0)}</div>
        </div>
      </div>
    </div>
  );
};
