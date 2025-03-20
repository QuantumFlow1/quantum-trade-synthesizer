
import { PriceDataPoint, MarketDataParams, DataValidationResult } from './types';
import { supabase } from "@/lib/supabase";

/**
 * Fetch market data from backend
 */
export const fetchMarketData = async (params: MarketDataParams): Promise<any[]> => {
  try {
    console.log("Fetching market data with params:", params);
    
    const { data, error } = await supabase.functions.invoke('fetch-market-data', {
      body: {
        symbol: params.symbol,
        interval: params.interval,
        limit: params.limit
      }
    });
    
    if (error) {
      console.error("Error fetching market data:", error);
      throw new Error(`Failed to fetch market data: ${error.message}`);
    }
    
    // Check if data is valid
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data format received:", data);
      throw new Error("Invalid data format received from server");
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchMarketData:", error);
    throw error;
  }
};

/**
 * Validate market data and convert to PriceDataPoint format
 */
export const validateMarketData = (data: any[]): DataValidationResult => {
  // Check if data is empty
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { 
      valid: false, 
      message: "No data received or invalid data format" 
    };
  }
  
  try {
    // Convert data to PriceDataPoint format with more flexible validation
    const formattedData: PriceDataPoint[] = data.map(item => {
      // Extract timestamp - accept different formats
      const timestamp = item.timestamp ? 
        (typeof item.timestamp === 'number' ? item.timestamp : new Date(item.timestamp).getTime()) : 
        Date.now();
      
      // Handle different price field names
      const open = typeof item.open !== 'undefined' ? item.open : item.price || 0;
      const close = typeof item.close !== 'undefined' ? item.close : item.price || 0;
      const high = typeof item.high !== 'undefined' ? item.high : item.high24h || close;
      const low = typeof item.low !== 'undefined' ? item.low : item.low24h || close;
      const volume = typeof item.volume !== 'undefined' ? item.volume : 0;
      
      // Make sure all values are properly typed as numbers
      return {
        timestamp: Number(timestamp),
        date: new Date(timestamp),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume)
      };
    });
    
    return {
      valid: true,
      data: formattedData
    };
  } catch (error) {
    console.error("Error validating market data:", error);
    return {
      valid: false,
      message: error instanceof Error ? error.message : "Unknown error validating data"
    };
  }
};

/**
 * Convert legacy data format to PriceDataPoint format
 */
export const convertLegacyData = (data: any[]): PriceDataPoint[] => {
  return data.map(item => ({
    timestamp: typeof item.timestamp === 'number' ? item.timestamp : new Date(item.timestamp).getTime(),
    date: new Date(item.timestamp),
    open: item.open || item.price || 0,
    high: item.high || item.price || 0,
    low: item.low || item.price || 0,
    close: item.close || item.price || 0,
    volume: item.volume || 0
  }));
};
