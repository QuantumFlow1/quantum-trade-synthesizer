
import React from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarketData } from '../types';
import { formatCurrency, formatDate, formatLargeNumber, formatPercentage } from '../utils/formatters';

interface MarketStatisticsProps {
  marketData: MarketData;
}

export const MarketStatistics: React.FC<MarketStatisticsProps> = ({ marketData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Price Statistics</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">Price</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Current price in USD</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">{formatCurrency(marketData.price)}</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">24h Low / High</span>
            </div>
            <span className="font-medium">
              {formatCurrency(marketData.low24h)} / {formatCurrency(marketData.high24h)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">All-Time High</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(marketData.ath)}</div>
              <div className="text-xs text-gray-500">{formatDate(marketData.athDate)}</div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">All-Time Low</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(marketData.atl)}</div>
              <div className="text-xs text-gray-500">{formatDate(marketData.atlDate)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Market Stats</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Market Cap</span>
            <span className="font-medium">${formatLargeNumber(marketData.marketCap)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Volume (24h)</span>
            <span className="font-medium">${formatLargeNumber(marketData.totalVolume24h)}</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className="text-gray-600">Volume / Market Cap</span>
            </div>
            <span className="font-medium">
              {marketData.totalVolume24h && marketData.marketCap ? 
                (marketData.totalVolume24h / marketData.marketCap).toFixed(4) : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Circulating Supply</span>
            <span className="font-medium">{formatLargeNumber(marketData.circulatingSupply)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Supply</span>
            <span className="font-medium">{formatLargeNumber(marketData.totalSupply)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Performance</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">24h</span>
            <span className={`font-medium ${
              (marketData.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercentage(marketData.change24h)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">7d</span>
            <span className={`font-medium ${
              (marketData.priceChange7d || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercentage(marketData.priceChange7d)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">30d</span>
            <span className={`font-medium ${
              (marketData.priceChange30d || 0) >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercentage(marketData.priceChange30d)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">
              {marketData.lastUpdated ? formatDate(marketData.lastUpdated) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
