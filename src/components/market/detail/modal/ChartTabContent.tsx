
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Twitter, BarChart, ExternalLink } from 'lucide-react';
import { ChartData, MarketData } from '../../types';
import { MarketChartView } from '../../MarketChartView';
import { formatLargeNumber, formatPercentage, formatCurrency } from '../../utils/formatters';

interface ChartTabContentProps {
  marketData: MarketData;
  marketName: string;
  data: ChartData[];
  isPriceUp: boolean;
}

export const ChartTabContent: React.FC<ChartTabContentProps> = ({ 
  marketData, 
  marketName, 
  data,
  isPriceUp 
}) => {
  return (
    <div className="space-y-6">
      <MarketChartView data={data} type="price" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Market Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-medium">${formatLargeNumber(marketData.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">24h Volume</span>
              <span className="font-medium">${formatLargeNumber(marketData.volume)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Circulating Supply</span>
              <span className="font-medium">{formatLargeNumber(marketData.circulatingSupply)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Price Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">24h Change</span>
              <span className={`font-medium ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(marketData.change24h)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">24h High / Low</span>
              <span className="font-medium">
                ${marketData.high.toFixed(2)} / ${marketData.low.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">All-Time High</span>
              <span className="font-medium">${formatCurrency(marketData.ath)}</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Links</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://www.coingecko.com/en/coins/${marketName?.split('/')[0].toLowerCase()}`, "_blank")}>
              <Globe className="h-4 w-4 mr-2" />
              Official Website
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://twitter.com/search?q=%24${marketName?.split('/')[0]}`, "_blank")}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => window.open(`https://www.tradingview.com/symbols/${marketName?.replace('/', '')}`, "_blank")}>
              <BarChart className="h-4 w-4 mr-2" />
              TradingView
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
