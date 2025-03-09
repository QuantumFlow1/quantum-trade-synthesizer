
import { supabase } from "@/lib/supabase";
import { generateTradingData } from "@/utils/tradingData";
import { formatMarketData } from "./market-data-formatter";
import { MarketDataValidationResult } from "./types";

/**
 * Fetches market data from the API or returns simulated data
 */
export const fetchMarketData = async (
  isLoading: boolean,
  lastFetchTime: Date | null,
  apiStatus: string,
  forceSimulation: boolean,
  setRawMarketData: (data: any) => void,
  setErrorCount: (count: number | ((prev: number) => number)) => void,
  useRealData: boolean = false
): Promise<any[]> => {
  // Prevent multiple concurrent calls
  if (isLoading) {
    console.log("Fetch already in progress, skipping");
    return [];
  }
  
  // Throttle API calls - don't call more often than every 3 seconds
  if (lastFetchTime && new Date().getTime() - lastFetchTime.getTime() < 3000) {
    console.log("Throttling API calls - too frequent");
    return [];
  }
  
  try {
    if (forceSimulation) {
      console.log("Forcing simulation mode, using generated data");
      const generatedData = generateTradingData();
      return generatedData;
    }
    
    // Check if we should use real market data from CoinGecko
    if (useRealData && apiStatus === 'available') {
      console.log("Fetching real cryptocurrency market data...");
      try {
        const { data: realMarketData, error } = await supabase.functions.invoke('real-crypto-data');
        
        if (error) {
          console.error("Error fetching real market data:", error);
          throw new Error(`Real data fetch failed: ${error.message}`);
        }
        
        if (realMarketData && realMarketData.success && Array.isArray(realMarketData.data)) {
          console.log("Successfully fetched real market data:", realMarketData.data.length, "items");
          setRawMarketData(realMarketData);
          setErrorCount(0); // Reset error count on success
          return realMarketData.data;
        } else {
          console.warn("Invalid response from real-crypto-data function:", realMarketData);
          throw new Error("Invalid real market data response");
        }
      } catch (realDataError) {
        console.error("Failed to fetch real market data:", realDataError);
        // Fall back to simulated data or other options
      }
    }
    
    if (apiStatus !== 'available') {
      console.log("API not available, using generated data");
      return generateTradingData();
    }
    
    const { data: marketData, error } = await supabase.functions.invoke('market-data-collector');
    
    if (error) {
      console.error("Error fetching market data:", error);
      setErrorCount(prev => prev + 1);
      return generateTradingData();
    }
    
    if (marketData) {
      console.log("Raw market data received:", marketData);
      setRawMarketData(marketData);
      setErrorCount(0); // Reset error count on success
      
      try {
        const validationResult = await validateMarketData(marketData);
        
        if (validationResult.valid && validationResult.data) {
          console.log("Using validated market data");
          return validationResult.data;
        } else {
          console.warn("Validation service returned invalid data, falling back to local formatting");
          return formatMarketData(marketData);
        }
      } catch (validationErr) {
        console.error("Exception in market data validation:", validationErr);
        return formatMarketData(marketData);
      }
    }
    
    return generateTradingData();
  } catch (error) {
    console.error("Error in fetchMarketData:", error);
    setErrorCount(prev => prev + 1);
    return generateTradingData();
  }
};

/**
 * Validates market data using the validator service
 */
export const validateMarketData = async (marketData: any): Promise<MarketDataValidationResult> => {
  try {
    const { data: validationResult, error: validationError } = await supabase.functions.invoke('market-data-validator', {
      body: { marketData, source: 'market-data-collector' }
    });
    
    if (validationError) {
      console.error("Error validating market data:", validationError);
      return { valid: false, data: null, error: validationError.message };
    }
    
    return validationResult || { valid: false, data: null, error: "Empty validation result" };
  } catch (error) {
    console.error("Exception in market data validation:", error);
    return { 
      valid: false, 
      data: null, 
      error: error instanceof Error ? error.message : "Unknown validation error" 
    };
  }
};
