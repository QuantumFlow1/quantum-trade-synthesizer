
import { TradingDataPoint } from "@/utils/tradingData";

type MarketSentiment = 'bullish' | 'bearish' | 'neutral';

export const useMarketSentiment = (data: TradingDataPoint[]): MarketSentiment => {
  // Early return if no data
  if (!data || data.length === 0) return 'neutral';
  
  // Calculate sentiment based on price trends
  const upTrends = data.filter(point => point.trend === 'up').length;
  const downTrends = data.filter(point => point.trend === 'down').length;
  
  // Calculate percentage of up trends
  const totalPoints = data.length;
  const upPercentage = (upTrends / totalPoints) * 100;
  
  // Determine sentiment
  if (upPercentage >= 60) return 'bullish';
  if (upPercentage <= 40) return 'bearish';
  return 'neutral';
};
