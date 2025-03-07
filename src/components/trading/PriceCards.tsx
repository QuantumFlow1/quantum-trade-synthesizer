
import React from "react";
import { Card } from "@/components/ui/card";
import { TradingDataPoint } from "@/utils/tradingData";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface PriceCardsProps {
  data: TradingDataPoint[];
}

export const PriceCards: React.FC<PriceCardsProps> = ({ data }) => {
  // Handle case when data is undefined or empty
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Current Price</div>
          <div className="text-2xl font-bold">--</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">24h Change</div>
          <div className="text-2xl font-bold">--</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">24h Volume</div>
          <div className="text-2xl font-bold">--</div>
        </Card>
      </div>
    );
  }
  
  const lastPoint = data[data.length - 1];
  const previousPoint = data.length > 1 ? data[data.length - 2] : lastPoint;
  
  const priceChange = lastPoint.close - previousPoint.close;
  const priceChangePercent = (priceChange / previousPoint.close) * 100;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Current Price</div>
        <div className="text-2xl font-bold">${lastPoint.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">24h Change</div>
        <div className={`text-2xl font-bold flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? <ArrowUpIcon className="mr-1 h-5 w-5" /> : <ArrowDownIcon className="mr-1 h-5 w-5" />}
          {priceChangePercent.toFixed(2)}%
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">24h Volume</div>
        <div className="text-2xl font-bold">${(lastPoint.volume * lastPoint.close).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
      </Card>
    </div>
  );
};
