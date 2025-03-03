
import { MarketData, ChartData } from '../types';

/**
 * Generate mock chart data based on market price
 * In a real application, you would fetch historical price data from an API
 */
export const generateChartData = (marketData: MarketData): ChartData[] => {
  const basePrice = marketData.price || 100;
  const volatility = 0.05; // 5% volatility
  
  // Generate 24 data points
  return Array(24).fill(0).map((_, i) => {
    const timestamp = Date.now() - (23 - i) * 3600 * 1000; // hourly data points
    const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
    const price = basePrice * randomFactor;
    
    return {
      name: new Date(timestamp).toISOString(),
      price: price,
      volume: Math.random() * 1000000,
      high: price * 1.01,
      low: price * 0.99,
    };
  });
};
