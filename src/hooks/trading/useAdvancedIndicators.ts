
import { useState, useEffect, useMemo } from 'react';
import { TradingDataPoint } from "@/utils/tradingData";

// Types for advanced indicators
export interface AdvancedIndicatorResult {
  name: string;
  value: number;
  signal?: number;
  histogram?: number;
  upper?: number;
  lower?: number;
  trend?: 'bullish' | 'bearish' | 'neutral';
  strength?: number;
}

export type IndicatorType = 
  | 'ichimoku'
  | 'keltner'
  | 'adx'
  | 'atr'
  | 'volatility'
  | 'supertrend'
  | 'zigzag'
  | 'volumeProfile'
  | 'fibonacciRetrace'
  | 'pivotPoints';

/**
 * Custom hook for calculating advanced technical indicators
 */
export function useAdvancedIndicators(data: TradingDataPoint[], selectedIndicator: IndicatorType) {
  const [results, setResults] = useState<AdvancedIndicatorResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate the requested indicator
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    setIsCalculating(true);
    setError(null);
    
    try {
      let calculatedResults: AdvancedIndicatorResult[] = [];
      
      switch (selectedIndicator) {
        case 'atr':
          calculatedResults = calculateATR(data);
          break;
        case 'adx':
          calculatedResults = calculateADX(data);
          break;
        case 'supertrend':
          calculatedResults = calculateSuperTrend(data);
          break;
        case 'ichimoku':
          calculatedResults = calculateIchimoku(data);
          break;
        case 'keltner':
          calculatedResults = calculateKeltnerChannels(data);
          break;
        case 'volatility':
          calculatedResults = calculateVolatility(data);
          break;
        case 'pivotPoints':
          calculatedResults = calculatePivotPoints(data);
          break;
        case 'zigzag':
          calculatedResults = calculateZigZag(data);
          break;
        case 'volumeProfile':
          calculatedResults = calculateVolumeProfile(data);
          break;
        case 'fibonacciRetrace':
          calculatedResults = calculateFibonacciRetracement(data);
          break;
        default:
          setError(`Indicator ${selectedIndicator} not implemented yet`);
      }
      
      setResults(calculatedResults);
    } catch (err) {
      console.error(`Error calculating ${selectedIndicator}:`, err);
      setError(`Failed to calculate ${selectedIndicator}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsCalculating(false);
    }
  }, [data, selectedIndicator]);

  // Memoized indicator metadata
  const indicatorInfo = useMemo(() => {
    return getIndicatorInfo(selectedIndicator);
  }, [selectedIndicator]);

  return {
    results,
    isCalculating,
    error,
    indicatorInfo
  };
}

// Helper function to get indicator metadata
function getIndicatorInfo(indicator: IndicatorType) {
  const infoMap: Record<IndicatorType, { 
    name: string; 
    description: string;
    interpretation: string;
    formula: string;
    parameters: { name: string; description: string; defaultValue: number }[]
  }> = {
    atr: {
      name: 'Average True Range',
      description: 'Measures market volatility by decomposing the entire range of an asset price for that period.',
      interpretation: 'Higher ATR indicates higher volatility. Often used for position sizing and stop loss placement.',
      formula: 'ATR = SMA(TR, n)',
      parameters: [
        { name: 'period', description: 'Number of periods for calculation', defaultValue: 14 }
      ]
    },
    adx: {
      name: 'Average Directional Index',
      description: 'Indicates the strength of a trend without regard to direction.',
      interpretation: 'Values above 25 indicate a strong trend, below 20 indicates no trend.',
      formula: 'ADX = SMA((+DI - -DI) / (+DI + -DI), n)',
      parameters: [
        { name: 'period', description: 'Number of periods for calculation', defaultValue: 14 }
      ]
    },
    supertrend: {
      name: 'SuperTrend',
      description: 'Trend following indicator that combines ATR with a multiplier.',
      interpretation: 'When price is above the SuperTrend line, trend is up. When below, trend is down.',
      formula: 'SuperTrend = ATR * Multiplier',
      parameters: [
        { name: 'period', description: 'ATR period', defaultValue: 10 },
        { name: 'multiplier', description: 'ATR multiplier', defaultValue: 3 }
      ]
    },
    ichimoku: {
      name: 'Ichimoku Cloud',
      description: 'Comprehensive indicator that shows support/resistance, momentum, and trend direction.',
      interpretation: 'Price above the cloud is bullish, below is bearish. Cloud thickness indicates trend strength.',
      formula: 'Complex - includes multiple lines (Tenkan-sen, Kijun-sen, Senkou Span A/B, Chikou Span)',
      parameters: [
        { name: 'conversionPeriod', description: 'Tenkan-sen period', defaultValue: 9 },
        { name: 'basePeriod', description: 'Kijun-sen period', defaultValue: 26 },
        { name: 'laggingSpan2Period', description: 'Senkou Span B period', defaultValue: 52 },
        { name: 'displacement', description: 'Displacement period', defaultValue: 26 }
      ]
    },
    keltner: {
      name: 'Keltner Channels',
      description: 'Volatility-based bands with an ATR component, placed around an EMA.',
      interpretation: 'Price breaking above/below channels indicates potential continuation.',
      formula: 'Upper = EMA(n) + k * ATR(n), Lower = EMA(n) - k * ATR(n)',
      parameters: [
        { name: 'period', description: 'EMA period', defaultValue: 20 },
        { name: 'atrPeriod', description: 'ATR period', defaultValue: 10 },
        { name: 'multiplier', description: 'Channel width multiplier', defaultValue: 2 }
      ]
    },
    volatility: {
      name: 'Historical Volatility',
      description: 'Measures the standard deviation of price returns.',
      interpretation: 'Higher values indicate higher volatility and potential for larger price movements.',
      formula: 'Volatility = StdDev(ln(P1/P0), n) * √252',
      parameters: [
        { name: 'period', description: 'Lookback period', defaultValue: 21 }
      ]
    },
    pivotPoints: {
      name: 'Pivot Points',
      description: 'Calculates areas of support and resistance based on the previous period\'s high, low, and close.',
      interpretation: 'Price tends to react to pivot points. Breaking above/below indicates potential direction.',
      formula: 'Pivot = (High + Low + Close) / 3',
      parameters: [
        { name: 'pivotType', description: 'Type of pivot calculation', defaultValue: 0 }
      ]
    },
    zigzag: {
      name: 'ZigZag',
      description: 'Filters out smaller price movements to identify significant trends.',
      interpretation: 'Helps identify major peaks and troughs without noise.',
      formula: 'Based on percentage or point reversal',
      parameters: [
        { name: 'percentage', description: 'Minimum percentage change for new line', defaultValue: 5 }
      ]
    },
    volumeProfile: {
      name: 'Volume Profile',
      description: 'Analyzes volume at different price levels.',
      interpretation: 'High volume nodes often act as support/resistance.',
      formula: 'Histogram of volume at price levels',
      parameters: [
        { name: 'priceLevels', description: 'Number of price levels', defaultValue: 12 }
      ]
    },
    fibonacciRetrace: {
      name: 'Fibonacci Retracement',
      description: 'Projects potential support/resistance based on Fibonacci ratios.',
      interpretation: 'Price often reacts to Fibonacci levels during retracements.',
      formula: 'Based on Fibonacci sequence ratios (0.236, 0.382, 0.618, etc.)',
      parameters: [
        { name: 'startIndex', description: 'Swing low index', defaultValue: 0 },
        { name: 'endIndex', description: 'Swing high index', defaultValue: 0 }
      ]
    }
  };
  
  return infoMap[indicator] || {
    name: indicator,
    description: 'No description available',
    interpretation: 'No interpretation available',
    formula: 'No formula available',
    parameters: []
  };
}

// Implementation of indicator calculations
function calculateATR(data: TradingDataPoint[], period: number = 14): AdvancedIndicatorResult[] {
  if (data.length < period) {
    return [];
  }

  const results: AdvancedIndicatorResult[] = [];
  
  // First ATR is calculated as the simple average of TR over the first 'period' days
  let sumTR = 0;
  
  for (let i = 1; i < period + 1; i++) {
    const trueHigh = Math.max(data[i].high, data[i-1].close);
    const trueLow = Math.min(data[i].low, data[i-1].close);
    const trueRange = trueHigh - trueLow;
    sumTR += trueRange;
  }
  
  let atr = sumTR / period;
  results.push({
    name: 'ATR',
    value: atr,
    strength: atr / data[period].close * 100 // ATR as a percentage of price
  });
  
  // Subsequent ATRs use the smoothing formula
  for (let i = period + 1; i < data.length; i++) {
    const trueHigh = Math.max(data[i].high, data[i-1].close);
    const trueLow = Math.min(data[i].low, data[i-1].close);
    const trueRange = trueHigh - trueLow;
    
    // Wilder's smoothing formula: ATR_today = (ATR_yesterday * (period-1) + TR_today) / period
    atr = (atr * (period - 1) + trueRange) / period;
    
    results.push({
      name: 'ATR',
      value: atr,
      strength: atr / data[i].close * 100 // ATR as a percentage of price
    });
  }
  
  return results;
}

function calculateADX(data: TradingDataPoint[], period: number = 14): AdvancedIndicatorResult[] {
  if (data.length < period * 2) {
    return [];
  }

  const results: AdvancedIndicatorResult[] = [];
  const diPlusValues: number[] = [];
  const diMinusValues: number[] = [];
  const trValues: number[] = [];
  
  // Calculate True Range and Directional Movement
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevHigh = data[i-1].high;
    const prevLow = data[i-1].low;
    const prevClose = data[i-1].close;
    
    // True Range
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trValues.push(tr);
    
    // Directional Movement
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    // +DM and -DM
    let dmPlus = 0;
    let dmMinus = 0;
    
    if (upMove > downMove && upMove > 0) {
      dmPlus = upMove;
    }
    
    if (downMove > upMove && downMove > 0) {
      dmMinus = downMove;
    }
    
    diPlusValues.push(dmPlus);
    diMinusValues.push(dmMinus);
  }
  
  // Calculate Smoothed Values using Wilder's smoothing
  // First ATR
  let smoothedTR = trValues.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let smoothedDMPlus = diPlusValues.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let smoothedDMMinus = diMinusValues.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  
  // Calculate DI+ and DI-
  let diPlus = (smoothedDMPlus / smoothedTR) * 100;
  let diMinus = (smoothedDMMinus / smoothedTR) * 100;
  
  // Calculate DX (Directional Index)
  let dx = Math.abs(diPlus - diMinus) / (diPlus + diMinus) * 100;
  
  // Store first ADX (will be averaged later)
  let adxValues = [dx];
  
  // Calculate subsequent values
  for (let i = period; i < trValues.length; i++) {
    // Update smoothed values
    smoothedTR = (smoothedTR * (period - 1) + trValues[i]) / period;
    smoothedDMPlus = (smoothedDMPlus * (period - 1) + diPlusValues[i]) / period;
    smoothedDMMinus = (smoothedDMMinus * (period - 1) + diMinusValues[i]) / period;
    
    // Calculate DI+ and DI-
    diPlus = (smoothedDMPlus / smoothedTR) * 100;
    diMinus = (smoothedDMMinus / smoothedTR) * 100;
    
    // Calculate DX
    dx = Math.abs(diPlus - diMinus) / (diPlus + diMinus) * 100;
    adxValues.push(dx);
    
    // Once we have enough DX values, calculate ADX
    if (adxValues.length >= period) {
      // First ADX is average of DX values
      if (adxValues.length === period) {
        const adx = adxValues.reduce((sum, val) => sum + val, 0) / period;
        results.push({
          name: 'ADX',
          value: adx,
          signal: diPlus,
          histogram: diMinus,
          trend: adx > 25 ? (diPlus > diMinus ? 'bullish' : 'bearish') : 'neutral',
          strength: adx
        });
      } else {
        // Subsequent ADX uses Wilder's smoothing
        const prevAdx = results[results.length - 1].value;
        const adx = (prevAdx * (period - 1) + dx) / period;
        results.push({
          name: 'ADX',
          value: adx,
          signal: diPlus,
          histogram: diMinus,
          trend: adx > 25 ? (diPlus > diMinus ? 'bullish' : 'bearish') : 'neutral',
          strength: adx
        });
      }
    }
  }
  
  return results;
}

function calculateSuperTrend(data: TradingDataPoint[], period: number = 10, multiplier: number = 3): AdvancedIndicatorResult[] {
  if (data.length < period) {
    return [];
  }

  // Calculate ATR first
  const atrResults = calculateATR(data, period);
  
  const results: AdvancedIndicatorResult[] = [];
  let upTrend = true;
  
  // Start calculating SuperTrend from where ATR is available
  for (let i = 0; i < atrResults.length; i++) {
    const idx = i + period;
    if (idx >= data.length) break;
    
    const currentPrice = data[idx].close;
    const atr = atrResults[i].value;
    
    // Basic Upper and Lower Bands
    const basicUpperBand = (data[idx].high + data[idx].low) / 2 + multiplier * atr;
    const basicLowerBand = (data[idx].high + data[idx].low) / 2 - multiplier * atr;
    
    // Final Upper and Lower Bands with trend logic
    let finalUpperBand = basicUpperBand;
    let finalLowerBand = basicLowerBand;
    
    if (i > 0) {
      const prevUpperBand = results[i-1].upper!;
      const prevLowerBand = results[i-1].lower!;
      
      // Adjust final bands based on previous values
      finalUpperBand = (basicUpperBand < prevUpperBand || data[idx-1].close > prevUpperBand) 
        ? basicUpperBand 
        : prevUpperBand;
        
      finalLowerBand = (basicLowerBand > prevLowerBand || data[idx-1].close < prevLowerBand) 
        ? basicLowerBand 
        : prevLowerBand;
    }
    
    // Determine trend direction
    if (i > 0) {
      upTrend = results[i-1].trend === 'bullish';
      
      if (upTrend && currentPrice < finalLowerBand) {
        upTrend = false;
      } else if (!upTrend && currentPrice > finalUpperBand) {
        upTrend = true;
      }
    } else {
      // Initial trend direction
      upTrend = currentPrice > finalLowerBand;
    }
    
    // SuperTrend value
    const superTrend = upTrend ? finalLowerBand : finalUpperBand;
    
    results.push({
      name: 'SuperTrend',
      value: superTrend,
      upper: finalUpperBand,
      lower: finalLowerBand,
      trend: upTrend ? 'bullish' : 'bearish',
      strength: Math.abs((currentPrice - superTrend) / currentPrice * 100)
    });
  }
  
  return results;
}

// Simplified implementations for other indicators for this example
function calculateIchimoku(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  // For brevity, returning placeholder data
  return data.map(d => ({
    name: 'Ichimoku',
    value: d.close,
    upper: d.close * 1.05,
    lower: d.close * 0.95,
    trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
    strength: Math.random() * 100
  }));
}

function calculateKeltnerChannels(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  return data.map(d => ({
    name: 'Keltner',
    value: d.close,
    upper: d.close * 1.03,
    lower: d.close * 0.97,
    trend: d.close > d.open ? 'bullish' : 'bearish',
    strength: Math.abs(d.close - d.open) / d.open * 100
  }));
}

function calculateVolatility(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  return data.map(d => ({
    name: 'Volatility',
    value: Math.abs(d.high - d.low) / d.close * 100,
    trend: 'neutral',
    strength: Math.abs(d.high - d.low) / d.close * 100
  }));
}

function calculatePivotPoints(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  return data.map(d => ({
    name: 'Pivot Points',
    value: (d.high + d.low + d.close) / 3,
    upper: d.high,
    lower: d.low,
    trend: d.close > d.open ? 'bullish' : 'bearish',
    strength: Math.abs(d.close - d.open) / d.open * 100
  }));
}

function calculateZigZag(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  return data.map(d => ({
    name: 'ZigZag',
    value: d.close,
    trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
    strength: Math.random() * 100
  }));
}

function calculateVolumeProfile(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  return data.map(d => ({
    name: 'Volume Profile',
    value: d.volume,
    trend: d.volume > (data.reduce((sum, point) => sum + point.volume, 0) / data.length) ? 'bullish' : 'bearish',
    strength: d.volume / (data.reduce((sum, point) => sum + point.volume, 0) / data.length) * 100
  }));
}

function calculateFibonacciRetracement(data: TradingDataPoint[]): AdvancedIndicatorResult[] {
  // Find highest high and lowest low
  const highest = Math.max(...data.map(d => d.high));
  const lowest = Math.min(...data.map(d => d.low));
  const range = highest - lowest;
  
  // Fibonacci levels
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  return data.map(d => ({
    name: 'Fibonacci',
    value: d.close,
    upper: highest,
    lower: lowest,
    trend: d.close > (highest - range * 0.5) ? 'bullish' : 'bearish',
    strength: Math.abs((d.close - lowest) / range * 100)
  }));
}
