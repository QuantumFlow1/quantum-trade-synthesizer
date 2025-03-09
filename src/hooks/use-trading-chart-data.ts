import { useState, useEffect, useCallback } from "react";
import { generateTradingData } from "@/utils/tradingData";
import { checkApiKeysAvailability } from "./trading-chart/api-key-manager";
import { fetchMarketData } from "./trading-chart/market-data-service";
import { checkApiStatus, retryConnection } from "./trading-chart/api-status-manager";
import { ApiStatus, TradingChartState } from "./trading-chart/types";
import { toast } from "@/hooks/use-toast";

export type { ApiStatus } from "./trading-chart/types";

export function useTradingChartData(forceSimulation: boolean) {
  // State variables
  const [state, setState] = useState<TradingChartState>({
    data: generateTradingData(),
    apiStatus: 'checking',
    lastAPICheckTime: null,
    apiKeysAvailable: false,
    rawMarketData: null,
    isLoading: false,
    errorCount: 0,
    lastFetchTime: null
  });

  // Destructure state for easier access
  const {
    data,
    apiStatus,
    lastAPICheckTime,
    apiKeysAvailable,
    rawMarketData,
    isLoading,
    errorCount,
    lastFetchTime
  } = state;

  // Helper functions to update specific parts of state
  const updateState = (newState: Partial<TradingChartState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Fetch market data implementation
  const fetchMarketDataImpl = useCallback(async () => {
    // Set loading state
    updateState({ isLoading: true });
    updateState({ lastFetchTime: new Date() });
    
    try {
      // Always use simulation data if forceSimulation is true
      if (forceSimulation) {
        console.log("Simulation mode active, using generated data");
        const simulatedData = generateTradingData();
        updateState({ 
          data: simulatedData,
          isLoading: false 
        });
        return simulatedData;
      }
      
      const result = await fetchMarketData(
        isLoading,
        lastFetchTime,
        apiStatus,
        forceSimulation, 
        (rawData) => updateState({ rawMarketData: rawData }),
        (count) => updateState({ 
          errorCount: typeof count === 'function' ? count(errorCount) : count 
        })
      );
      
      if (result && result.length > 0) {
        console.log("Successfully fetched market data:", result.length, "data points");
        updateState({ data: result });
        return result;
      } else {
        console.warn("Empty data returned from fetchMarketData, using generated data");
        const fallbackData = generateTradingData();
        updateState({ data: fallbackData });
        return fallbackData;
      }
    } catch (error) {
      console.error("Error in fetchMarketDataImpl:", error);
      const fallbackData = generateTradingData();
      updateState({ data: fallbackData });
      toast({
        title: "Data Loading Error",
        description: "Failed to load market data. Using simulated data instead.",
        variant: "destructive"
      });
      return fallbackData;
    } finally {
      updateState({ isLoading: false });
    }
  }, [
    apiStatus, 
    forceSimulation, 
    isLoading, 
    lastFetchTime, 
    errorCount
  ]);

  // API Status check
  const checkApiStatusImpl = useCallback(async () => {
    await checkApiStatus(
      (status) => updateState({ apiStatus: status }),
      (time) => updateState({ lastAPICheckTime: time }),
      (available) => updateState({ apiKeysAvailable: available }),
      forceSimulation,
      lastAPICheckTime,
      fetchMarketDataImpl
    );
  }, [forceSimulation, lastAPICheckTime, fetchMarketDataImpl]);

  // Connection retry handler
  const handleRetryConnection = useCallback(async () => {
    await retryConnection(
      (status) => updateState({ apiStatus: status }),
      (time) => updateState({ lastAPICheckTime: time }),
      checkApiKeysAvailability,
      (available) => updateState({ apiKeysAvailable: available }),
      fetchMarketDataImpl
    );
  }, [fetchMarketDataImpl]);

  // Initial API check
  useEffect(() => {
    checkApiStatusImpl();
    // Reduce frequency of API checks to prevent flooding
    const intervalId = setInterval(checkApiStatusImpl, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [forceSimulation, checkApiStatusImpl]);

  // Regular data update interval - with error backoff
  useEffect(() => {
    // If we have too many errors, increase the interval time
    const updateInterval = errorCount > 5 ? 15000 : errorCount > 2 ? 10000 : 5000;
    
    const dataInterval = setInterval(() => {
      if (forceSimulation) {
        updateState({ data: generateTradingData() });
      } else if (apiStatus === 'available' && !isLoading) {
        fetchMarketDataImpl();
      } else if (apiStatus !== 'available') {
        // If API is not available, use simulated data but keep updating
        console.log("API not available, using generated data");
        updateState({ data: generateTradingData() });
      }
    }, updateInterval);

    return () => clearInterval(dataInterval);
  }, [forceSimulation, apiStatus, fetchMarketDataImpl, errorCount, isLoading]);

  // Add refresh function to manually trigger data refresh
  const refresh = useCallback(() => {
    console.log("Manual refresh requested");
    return fetchMarketDataImpl();
  }, [fetchMarketDataImpl]);

  return {
    data,
    apiStatus,
    apiKeysAvailable,
    lastAPICheckTime,
    rawMarketData,
    handleRetryConnection,
    fetchMarketData: fetchMarketDataImpl,
    isLoading,
    refresh // Add refresh function to the return object
  };
}
