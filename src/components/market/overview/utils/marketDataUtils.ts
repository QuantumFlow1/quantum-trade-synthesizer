
import { MarketData } from "@/components/market/types";

/**
 * Validates market data structure and content
 */
export const validateMarketData = (marketData: any): { 
  isValid: boolean; 
  errorMessage: string;
} => {
  try {
    if (!marketData) {
      return { isValid: false, errorMessage: "Geen marktdata ontvangen" };
    }

    // Check if the data is in the expected format or wrapped inside a data property
    const dataToValidate = Array.isArray(marketData) ? marketData : 
                          (marketData.data && Array.isArray(marketData.data)) ? marketData.data : null;
    
    if (!dataToValidate) {
      console.error('Market data is not an array or does not contain data array:', marketData);
      return { isValid: false, errorMessage: "Ongeldig dataformaat ontvangen" };
    }

    if (dataToValidate.length === 0) {
      return { isValid: false, errorMessage: "Lege marktdata ontvangen" };
    }

    // Basic validation for data structure
    const isValidData = dataToValidate.every(item => 
      item && 
      typeof item.market === 'string' &&
      typeof item.symbol === 'string' &&
      // Allow price to be either number or string (will convert later)
      (typeof item.price === 'number' || (typeof item.price === 'string' && !isNaN(parseFloat(item.price))))
    );

    if (!isValidData) {
      return { isValid: false, errorMessage: "Ongeldige datastructuur" };
    }

    return { isValid: true, errorMessage: "" };
  } catch (error) {
    console.error('Error validating market data:', error);
    return { 
      isValid: false, 
      errorMessage: error instanceof Error ? error.message : "Onbekende fout bij validatie"
    };
  }
};

/**
 * Normalizes market data to ensure consistent structure
 */
export const normalizeMarketData = (marketData: any): MarketData[] => {
  // Check if the data is in the expected format or wrapped inside a data property
  const dataToNormalize = Array.isArray(marketData) ? marketData : 
                         (marketData.data && Array.isArray(marketData.data)) ? marketData.data : [];
  
  if (dataToNormalize.length === 0) {
    return [];
  }

  return dataToNormalize.map(item => ({
    market: item.market,
    symbol: item.symbol,
    name: item.name || item.symbol,
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
    change24h: typeof item.change24h === 'number' ? item.change24h : 
              typeof item.change24h === 'string' ? parseFloat(item.change24h) : 0,
    high24h: typeof item.high24h === 'number' ? item.high24h : 
            typeof item.high24h === 'string' ? parseFloat(item.high24h) : 
            (item.price * 1.05), // Estimate if missing
    low24h: typeof item.low24h === 'number' ? item.low24h : 
           typeof item.low24h === 'string' ? parseFloat(item.low24h) : 
           (item.price * 0.95), // Estimate if missing
    volume: typeof item.volume === 'number' ? item.volume : 
           typeof item.volume === 'string' ? parseFloat(item.volume) : 
           100000, // Default value if missing
    timestamp: item.timestamp || Date.now(),
    marketCap: item.marketCap || (typeof item.price === 'number' ? item.price * 1000000 : 0),
    totalVolume24h: item.totalVolume24h || item.volume || 0,
    high: item.high || item.high24h || (typeof item.price === 'number' ? item.price * 1.05 : 0),
    low: item.low || item.low24h || (typeof item.price === 'number' ? item.price * 0.95 : 0)
  }));
};

export const groupMarketDataByMarket = (marketData: MarketData[]): Record<string, any[]> => {
  if (!Array.isArray(marketData)) {
    console.error('Cannot group non-array marketData:', marketData);
    return {};
  }
  
  return marketData.reduce((acc, item) => {
    if (!item.market) {
      return acc;
    }
    
    if (!acc[item.market]) {
      acc[item.market] = [];
    }
    
    acc[item.market].push({
      name: item.symbol,
      volume: item.volume,
      price: item.price,
      change: item.change24h,
      high: item.high24h,
      low: item.low24h
    });
    
    return acc;
  }, {} as Record<string, any[]>);
};
