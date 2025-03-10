
import { supabase } from "@/lib/supabase";

/**
 * Fetches real market data from the real-crypto-data edge function
 */
export const fetchRealMarketData = async () => {
  try {
    console.log("Fetching real market data from the real-crypto-data edge function");
    
    const { data, error } = await supabase.functions.invoke('real-crypto-data');
    
    if (error) {
      console.error("Error fetching real market data:", error);
      throw new Error(`Failed to fetch real market data: ${error.message}`);
    }
    
    if (!data || !data.success || !Array.isArray(data.data)) {
      console.error("Invalid data format received from real-crypto-data:", data);
      throw new Error("Invalid data format received from server");
    }
    
    console.log(`Successfully fetched ${data.data.length} real market data points from ${data.source}`);
    return data.data;
  } catch (error) {
    console.error("Error in fetchRealMarketData:", error);
    throw error;
  }
};

/**
 * Fetches real market data for a specific symbol
 */
export const fetchRealSymbolData = async (symbol: string) => {
  try {
    const allData = await fetchRealMarketData();
    
    // Find the specific symbol in the data
    const symbolData = allData.find(item => 
      item.symbol.toUpperCase() === symbol.toUpperCase()
    );
    
    if (!symbolData) {
      console.warn(`Symbol ${symbol} not found in real market data`);
      return null;
    }
    
    return symbolData;
  } catch (error) {
    console.error(`Error fetching real data for symbol ${symbol}:`, error);
    return null;
  }
};

/**
 * Checks if real data is available by testing the API
 */
export const checkRealDataAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking real data availability");
    const { data, error } = await supabase.functions.invoke('real-crypto-data', {
      body: { test: true }
    });
    
    if (error) {
      console.error("Error checking real data availability:", error);
      return false;
    }
    
    const available = data && data.success;
    console.log(`Real data availability: ${available ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    return available;
  } catch (error) {
    console.error("Error checking real data availability:", error);
    return false;
  }
};
