
import { MarketData } from "@/components/market/types";

export const validateMarketData = (marketData: any): { 
  isValid: boolean; 
  errorMessage: string;
} => {
  try {
    if (!marketData) {
      return { isValid: false, errorMessage: "Geen marktdata ontvangen" };
    }

    if (!Array.isArray(marketData)) {
      console.error('Market data is not an array:', marketData);
      return { isValid: false, errorMessage: "Ongeldig dataformaat ontvangen" };
    }

    if (marketData.length === 0) {
      return { isValid: false, errorMessage: "Lege marktdata ontvangen" };
    }

    // Basic validation for data structure
    const isValidData = marketData.every(item => 
      item && 
      typeof item.market === 'string' &&
      typeof item.symbol === 'string' &&
      typeof item.price === 'number'
    );

    if (!isValidData) {
      return { isValid: false, errorMessage: "Ongeldige datastructuur" };
    }

    return { isValid: true, errorMessage: "" };
  } catch (error) {
    return { 
      isValid: false, 
      errorMessage: error instanceof Error ? error.message : "Onbekende fout"
    };
  }
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
