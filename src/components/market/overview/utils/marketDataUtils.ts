
import { MarketData } from '../../types';

export const validateMarketData = (marketData: any): { isValid: boolean; errorMessage: string } => {
  // Check if data exists
  if (!marketData) {
    return { isValid: false, errorMessage: 'No market data received' };
  }
  
  // Handle both array format and { data: [] } format
  const dataArray = Array.isArray(marketData) ? marketData : 
                    (marketData.data && Array.isArray(marketData.data)) ? marketData.data : null;
  
  if (!dataArray) {
    return { isValid: false, errorMessage: 'Invalid market data format' };
  }
  
  if (dataArray.length === 0) {
    return { isValid: false, errorMessage: 'Empty market data array' };
  }
  
  // Check if data has required fields
  for (const item of dataArray) {
    if (!item.name || (item.price === undefined) || (item.market === undefined)) {
      return { 
        isValid: false, 
        errorMessage: 'Market data items missing required fields (name, price, market)' 
      };
    }
  }
  
  return { isValid: true, errorMessage: '' };
};

export const normalizeMarketData = (data: any): MarketData[] => {
  // Handle both array format and { data: [] } format
  const dataArray = Array.isArray(data) ? data : 
                    (data.data && Array.isArray(data.data)) ? data.data : [];
  
  return dataArray.map(item => ({
    name: item.name || 'Unknown',
    price: item.price || 0,
    change: item.change || 0,
    volume: item.volume || 0,
    market: item.market || 'Unknown',
    timestamp: item.timestamp || new Date().toISOString()
  }));
};

export const groupMarketDataByMarket = (data: MarketData[]): Record<string, MarketData[]> => {
  return data.reduce((acc, item) => {
    if (!acc[item.market]) {
      acc[item.market] = [];
    }
    acc[item.market].push(item);
    return acc;
  }, {} as Record<string, MarketData[]>);
};
