
import { PriceDataPoint, TradingDataPoint } from './types';

/**
 * Converts PriceDataPoint[] to TradingDataPoint[] by adding required properties
 * with sensible default values for indicators
 */
export function convertToTradingDataPoints(priceData: PriceDataPoint[]): TradingDataPoint[] {
  return priceData.map((point, index) => {
    // Generate a simple moving average based on nearby points
    const sma = calculateSimpleSMA(priceData, index, 5);
    
    // Calculate a simple RSI based on price movements
    const rsi = calculateSimpleRSI(priceData, index, 14);
    
    // Generate random but plausible values for other indicators
    const macd = (point.close - sma) * 0.8;
    const signal = macd * 0.9;
    const histogram = macd - signal;
    
    // Simple bollinger bands (20% around SMA)
    const bollinger_middle = sma;
    const volatility = point.close * 0.02;
    const bollinger_upper = sma + (2 * volatility);
    const bollinger_lower = sma - (2 * volatility);
    
    return {
      ...point,
      name: new Date(point.timestamp).toLocaleDateString(),
      sma,
      ema: sma * 1.02,  // Simple approximation
      rsi,
      macd,
      signal,
      histogram,
      bollinger_upper,
      bollinger_middle,
      bollinger_lower,
      atr: volatility,
      cci: (point.close - sma) / volatility * 100,
      stochastic: Math.min(100, Math.max(0, rsi + (Math.random() * 10 - 5))),
      adx: Math.min(100, Math.max(0, 50 + (Math.random() * 20 - 10))),
      trend: point.close > sma ? "bullish" : "bearish",
      // Add compatibility fields
      macdSignal: signal,
      macdHistogram: histogram,
      bollingerUpper: bollinger_upper,
      bollingerLower: bollinger_lower,
      bollingerMiddle: bollinger_middle,
    };
  });
}

/**
 * Simple SMA calculation helper
 */
function calculateSimpleSMA(data: PriceDataPoint[], currentIndex: number, period: number): number {
  const startIndex = Math.max(0, currentIndex - period + 1);
  const values = data.slice(startIndex, currentIndex + 1).map(p => p.close);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Simple RSI calculation helper
 */
function calculateSimpleRSI(data: PriceDataPoint[], currentIndex: number, period: number): number {
  if (currentIndex < 1) return 50;  // Default for first point
  
  const startIndex = Math.max(0, currentIndex - period + 1);
  const values = data.slice(startIndex, currentIndex + 1);
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < values.length; i++) {
    const change = values[i].close - values[i-1].close;
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  const avgGain = gains / values.length;
  const avgLoss = losses / values.length;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

/**
 * Ensures timestamp is properly converted to Date objects
 */
export function ensureDateObjects(data: PriceDataPoint[]): PriceDataPoint[] {
  return data.map(point => ({
    ...point,
    date: point.date instanceof Date ? point.date : new Date(point.timestamp)
  }));
}
