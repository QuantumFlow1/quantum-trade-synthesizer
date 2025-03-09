
import { MarketDataParams, MarketDataValidationResult, PriceDataPoint } from './types';

export const fetchMarketData = async (params: MarketDataParams): Promise<any> => {
  const { symbol, interval, limit = 100 } = params;
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
  const baseUrl = 'https://www.alphavantage.co/query';
  
  if (!apiKey) {
    throw new Error('API key is missing. Please set the NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY environment variable.');
  }
  
  const url = `${baseUrl}?function=CRYPTO_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=compact&apikey=${apiKey}&datatype=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(`API Error: ${data['Error Message']}`);
    }
    
    // Adjust the data extraction to handle the time series data correctly
    const timeSeriesKey = Object.keys(data).find(key => key.startsWith('Time Series Crypto')) || 'Time Series Crypto (1min)';
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) {
      throw new Error('No time series data found in the API response.');
    }
    
    // Convert time series data to an array of objects
    const marketData = Object.entries(timeSeries).map(([timestamp, values]) => ({
      timestamp: new Date(timestamp).getTime(),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseFloat(values['5. volume']),
    }));
    
    // Limit the data based on the 'limit' parameter
    const limitedMarketData = marketData.slice(0, limit);
    
    return limitedMarketData;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
};

export const validateMarketData = (data: any): MarketDataValidationResult => {
  if (!data || !Array.isArray(data)) {
    return {
      valid: false,
      message: 'Invalid market data format: not an array',
      error: 'Invalid data structure'
    };
  }
  
  if (data.length === 0) {
    return {
      valid: false,
      message: 'Empty market data array',
      error: 'No data available'
    };
  }
  
  // Convert and validate each data point
  try {
    const processedData = data.map(item => {
      // Process timestamp to ensure it's a number
      const timestamp = typeof item.timestamp === 'number' ? 
        item.timestamp : 
        (typeof item.timestamp === 'string' ? parseInt(item.timestamp) : Date.now());
      
      return {
        timestamp,
        open: parseFloat(item.open || 0),
        high: parseFloat(item.high || 0),
        low: parseFloat(item.low || 0),
        close: parseFloat(item.close || 0),
        volume: parseFloat(item.volume || 0),
        date: new Date(timestamp)
      };
    });
    
    return {
      valid: true,
      data: processedData
    };
  } catch (error) {
    return {
      valid: false,
      message: 'Error processing market data',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const calculateSMA = (data: any[], period: number): number[] => {
  const smaValues: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    smaValues[i] = sum / period;
  }
  return smaValues;
};

export const calculateEMA = (data: any[], period: number): number[] => {
  const emaValues: number[] = [];
  const k = 2 / (period + 1);
  
  // Calculate the initial SMA as the starting point for EMA
  let sma = 0;
  for (let i = 0; i < period; i++) {
    sma += data[i].close;
  }
  sma /= period;
  emaValues[period - 1] = sma;
  
  // Calculate EMA values from the period onwards
  for (let i = period; i < data.length; i++) {
    emaValues[i] = (data[i].close * k) + (emaValues[i - 1] * (1 - k));
  }
  return emaValues;
};

export const calculateRSI = (data: any[], period: number = 14): number[] => {
  const rsiValues: number[] = [];
  let gains: number[] = [];
  let losses: number[] = [];
  
  // Calculate gains and losses
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains[i] = change > 0 ? change : 0;
    losses[i] = change < 0 ? Math.abs(change) : 0;
  }
  
  let avgGain = 0;
  let avgLoss = 0;
  
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    avgGain += gains[i] || 0;
    avgLoss += losses[i] || 0;
  }
  avgGain /= period;
  avgLoss /= period;
  
  rsiValues[period] = avgLoss === 0 ? 100 : (100 - (100 / (1 + (avgGain / avgLoss))));
  
  // Calculate RSI values from the period onwards
  for (let i = period + 1; i < data.length; i++) {
    avgGain = ((avgGain * (period - 1)) + (gains[i] || 0)) / period;
    avgLoss = ((avgLoss * (period - 1)) + (losses[i] || 0)) / period;
    
    rsiValues[i] = avgLoss === 0 ? 100 : (100 - (100 / (1 + (avgGain / avgLoss))));
  }
  
  return rsiValues;
};

export const calculateMACD = (data: any[]): any => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macdValues: number[] = [];
  
  for (let i = 25; i < data.length; i++) {
    const macd = ema12[i] - ema26[i];
    macdValues[i] = macd;
  }
  
  const signalLine = calculateEMA(
    data.map((d, i) => ({ ...d, close: macdValues[i] || 0 })), 
    9
  );
  
  const histogram: number[] = [];
  
  for (let i = 33; i < data.length; i++) {
    histogram[i] = macdValues[i] - signalLine[i];
  }
  
  return {
    macd: macdValues,
    signal: signalLine,
    histogram: histogram
  };
};

export const calculateBollingerBands = (data: any[], period: number = 20, stdDev: number = 2): any => {
  const sma = calculateSMA(data, period);
  const bollingerUpper: number[] = [];
  const bollingerLower: number[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[i - j].close - sma[i], 2);
    }
    const standardDeviation = Math.sqrt(sum / period);
    bollingerUpper[i] = sma[i] + (standardDeviation * stdDev);
    bollingerLower[i] = sma[i] - (standardDeviation * stdDev);
  }
  
  return {
    upper: bollingerUpper,
    middle: sma,
    lower: bollingerLower
  };
};

export const calculateATR = (data: any[], period: number = 14): number[] => {
  const atrValues: number[] = [];
  let trValues: number[] = [];
  
  // Calculate True Range (TR)
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const closePrev = data[i - 1].close;
    
    const highLow = high - low;
    const highClosePrev = Math.abs(high - closePrev);
    const lowClosePrev = Math.abs(low - closePrev);
    
    trValues[i] = Math.max(highLow, highClosePrev, lowClosePrev);
  }
  
  let atr = 0;
  // Calculate initial ATR
  for (let i = 1; i <= period; i++) {
    atr += trValues[i] || 0;
  }
  atr /= period;
  atrValues[period] = atr;
  
  // Calculate ATR values from the period onwards
  for (let i = period + 1; i < data.length; i++) {
    atr = ((atr * (period - 1)) + (trValues[i] || 0)) / period;
    atrValues[i] = atr;
  }
  
  return atrValues;
};
