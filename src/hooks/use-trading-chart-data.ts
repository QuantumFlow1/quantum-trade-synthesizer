
import { useState, useEffect, useCallback } from "react";
import { generateTradingData } from "@/utils/tradingData";
import { checkApiKeysAvailability } from "./trading-chart/api-key-manager";
import { fetchMarketData } from "./trading-chart/market-data-service";
import { checkApiStatus, retryConnection } from "./trading-chart/api-status-manager";
import { ApiStatus, TradingChartState } from "./trading-chart/types";

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
      
      updateState({ data: result });
      return result;
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
      }
    }, updateInterval);

    return () => clearInterval(dataInterval);
  }, [forceSimulation, apiStatus, fetchMarketDataImpl, errorCount, isLoading]);

  return {
    data,
    apiStatus,
    apiKeysAvailable,
    lastAPICheckTime,
    rawMarketData,
    handleRetryConnection,
    fetchMarketData: fetchMarketDataImpl,
    isLoading
  };
}
