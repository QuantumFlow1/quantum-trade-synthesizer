
import { TradingDataPoint } from "@/utils/tradingData";
import { Card } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

interface PriceCardsProps {
  data: TradingDataPoint[];
}

export const PriceCards = ({ data }: PriceCardsProps) => {
  const latestPrice = data[data.length - 1].close;
  const priceChange = data[data.length - 1].close - data[0].close;
  const percentageChange = ((priceChange / data[0].close) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          ${latestPrice.toFixed(2)}
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">24h Change</span>
          <Activity className="w-4 h-4" />
        </div>
        <div className={`mt-2 text-2xl font-bold ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}>
          {isPositive ? "+" : ""}{percentageChange}%
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-secondary/20 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Volume</span>
          <Activity className="w-4 h-4" />
        </div>
        <div className="mt-2 text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          ${(data.reduce((acc, curr) => acc + curr.volume, 0) * 1000).toLocaleString()}
        </div>
      </Card>
    </div>
  );
};
