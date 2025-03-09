
import { MarketData } from "../types";

interface MarketDataSummaryProps {
  marketData?: MarketData;
}

export const MarketDataSummary = ({ marketData }: MarketDataSummaryProps) => {
  if (!marketData) {
    return (
      <div className="bg-secondary/20 p-2 rounded-md mb-3 text-xs">
        <span className="text-muted-foreground">No specific market selected</span>
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 p-2 rounded-md mb-3 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{marketData.symbol}</span>
        <span className={marketData.change24h >= 0 ? "text-green-500" : "text-red-500"}>
          ${marketData.price.toFixed(2)} ({marketData.change24h}%)
        </span>
      </div>
    </div>
  );
};
