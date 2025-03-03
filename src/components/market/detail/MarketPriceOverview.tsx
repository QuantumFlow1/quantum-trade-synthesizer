
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketData } from '../types';
import { formatCurrency, formatLargeNumber, formatPercentage } from '../utils/formatters';

interface MarketPriceOverviewProps {
  marketData: MarketData;
}

export const MarketPriceOverview: React.FC<MarketPriceOverviewProps> = ({ marketData }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6">
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
          <span className="text-gray-500 text-sm ml-2">(24h)</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Market Cap</div>
          <div className="font-semibold">${formatLargeNumber(marketData.marketCap)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">24h Volume</div>
          <div className="font-semibold">${formatLargeNumber(marketData.totalVolume24h)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Circulating Supply</div>
          <div className="font-semibold">{formatLargeNumber(marketData.circulatingSupply)}</div>
        </div>
      </div>
    </div>
  );
};
