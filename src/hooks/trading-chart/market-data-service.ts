
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
    // Convert data to PriceDataPoint format
    const formattedData: PriceDataPoint[] = data.map(item => {
      // Basic validation for required fields
      if (!item.timestamp || typeof item.open !== 'number' || 
          typeof item.high !== 'number' || typeof item.low !== 'number' ||
          typeof item.close !== 'number') {
        throw new Error(`Invalid data point: ${JSON.stringify(item)}`);
      }
      
      return {
        timestamp: typeof item.timestamp === 'number' ? item.timestamp : new Date(item.timestamp).getTime(),
        date: new Date(item.timestamp),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume || 0
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
