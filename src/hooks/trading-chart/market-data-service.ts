
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
  setErrorCount: (count: number | ((prev: number) => number)) => void
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
    // If simulation is forced, return generated data immediately
    if (forceSimulation) {
      console.log("Forced simulation - using generated data");
      const generatedData = generateTradingData();
      return generatedData;
    }
    
    // Check if API is available, otherwise use generated data
    if (apiStatus !== 'available') {
      console.log("API not available, using generated data");
      return generateTradingData();
    }
    
    // Try to fetch from fetch-market-data function first (primary source)
    console.log("Attempting to fetch market data from primary source...");
    const { data: primaryData, error: primaryError } = await supabase.functions.invoke('fetch-market-data');
    
    if (!primaryError && primaryData && Array.isArray(primaryData) && primaryData.length > 0) {
      console.log("Successfully received data from primary source:", primaryData.length, "items");
      setRawMarketData(primaryData);
      setErrorCount(0); // Reset error count on success
      return primaryData;
    }
    
    if (primaryError) {
      console.log("Primary source error:", primaryError.message);
    } else {
      console.log("Primary source returned invalid data, trying fallback");
    }
    
    // If primary source fails, try market-data-collector as fallback
    console.log("Attempting to fetch market data from fallback source...");
    const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('market-data-collector');
    
    if (fallbackError) {
      console.error("Fallback source error:", fallbackError);
      setErrorCount(prev => prev + 1);
      return generateTradingData();
    }
    
    // Check if the fallback response has valid data
    if (fallbackData && fallbackData.data && Array.isArray(fallbackData.data)) {
      console.log("Successfully received data from fallback source:", fallbackData.data.length, "items");
      setRawMarketData(fallbackData.data);
      setErrorCount(0); // Reset error count on success
      return fallbackData.data;
    } else if (fallbackData && Array.isArray(fallbackData)) {
      console.log("Successfully received direct array from fallback source:", fallbackData.length, "items");
      setRawMarketData(fallbackData);
      setErrorCount(0); // Reset error count on success
      return fallbackData;
    }
    
    console.log("No valid data from either source, using generated data");
    setErrorCount(prev => prev + 1);
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
