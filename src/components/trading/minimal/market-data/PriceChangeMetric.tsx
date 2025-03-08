
import { TrendingUp, TrendingDown } from "lucide-react";
import { MarketMetricItem } from "./MarketMetricItem";

interface PriceChangeMetricProps {
  changePercent: number;
  formatNumber: (num: number, decimals?: number) => string;
}

export const PriceChangeMetric = ({ changePercent, formatNumber }: PriceChangeMetricProps) => {
  return (
    <MarketMetricItem
      label="Price Change"
      tooltip="Price change percentage over the period"
      value={
        <div className={`font-semibold flex items-center ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {changePercent >= 0 ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {changePercent >= 0 ? '+' : ''}{formatNumber(changePercent)}%
        </div>
      }
    />
  );
};
