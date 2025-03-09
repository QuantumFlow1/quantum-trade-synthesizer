
// Update this file to use the correct types and fix the errors
import { useState, useEffect, useCallback } from 'react';
import { TradingChartState, PriceDataPoint, ApiStatus, MarketDataParams } from './trading-chart/types';
import { fetchMarketData, validateMarketData } from './trading-chart/market-data-service';
import { getSimpleApiAvailability } from './trading-chart/api-key-manager';

// Initial state
const initialState: TradingChartState = {
  symbol: 'BTC',
  interval: '1h',
  data: [],
  loading: false,
  error: null,
  apiStatus: 'checking',
  lastAPICheckTime: 0,
  apiKeysAvailable: false,
  rawMarketData: [],
  isLoading: false,
  errorCount: 0,
  lastFetchTime: 0
};

export const useTradingChartData = (
  simulationMode: boolean = false,
  symbol: string = 'BTC',
  interval: string = '1h',
  limit: number = 100
) => {
  const [state, setState] = useState<TradingChartState>(initialState);
  
  // Update chart data based on symbol and interval
  useEffect(() => {
    setState(prev => ({
      ...prev,
      symbol,
      interval,
      loading: true,
      error: null
    }));
    
    fetchData(symbol, interval, limit);
  }, [symbol, interval, limit]);
  
  // Fetch market data
  const fetchData = useCallback(async (
    symbol: string,
    interval: string,
    limit: number
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      isLoading: true,
      lastFetchTime: Date.now()
    }));
    
    try {
      const response = await fetchMarketData({ symbol, interval, limit });
      const validationResult = validateMarketData(response);
      
      if (validationResult.valid && validationResult.data) {
        setState(prev => ({
          ...prev,
          data: validationResult.data,
          rawMarketData: response,
          loading: false,
          isLoading: false,
          error: null,
          errorCount: 0
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          isLoading: false,
          error: validationResult.message || 'Invalid market data',
          errorCount: (prev.errorCount || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market data',
        data: generateFallbackData(symbol, interval, limit),
        errorCount: (prev.errorCount || 0) + 1
      }));
    }
  }, []);
  
  // Check API status
  const checkAPIStatus = useCallback(async () => {
    setState(prev => ({
      ...prev,
      apiStatus: 'checking'
    }));
    
    try {
      const available = await getSimpleApiAvailability();
      const status: ApiStatus = available ? 'available' : 'unavailable';
      
      setState(prev => ({
        ...prev,
        apiStatus: status,
        lastAPICheckTime: Date.now(),
        apiKeysAvailable: available
      }));
      
      return { available, status };
    } catch (error) {
      console.error('Error checking API status:', error);
      
      setState(prev => ({
        ...prev,
        apiStatus: 'unavailable',
        lastAPICheckTime: Date.now(),
        apiKeysAvailable: false
      }));
      
      return { available: false, status: 'unavailable' };
    }
  }, []);
  
  // Refresh data
  const refreshData = useCallback(() => {
    fetchData(state.symbol, state.interval, limit);
  }, [fetchData, state.symbol, state.interval, limit]);
  
  // Alias for refresh method needed by visualizationPage
  const refresh = refreshData;
  
  // Handle retry connection
  const handleRetryConnection = useCallback(() => {
    checkAPIStatus().then(({ available }) => {
      if (available) {
        refreshData();
      }
    });
  }, [checkAPIStatus, refreshData]);
  
  // Generate fallback data
  const generateFallbackData = (
    symbol: string,
    interval: string,
    limit: number
  ): PriceDataPoint[] => {
    const now = Date.now();
    const intervalMs = getIntervalInMs(interval);
    
    return Array.from({ length: limit }).map((_, i) => {
      const timestamp = now - (limit - i - 1) * intervalMs;
      const basePrice = symbol === 'BTC' ? 45000 : 2000;
      const random = (Math.random() - 0.5) * 0.02;
      const close = basePrice * (1 + random);
      
      return {
        timestamp,
        open: close * (1 - Math.random() * 0.01),
        high: close * (1 + Math.random() * 0.01),
        low: close * (1 - Math.random() * 0.01),
        close,
        volume: Math.floor(Math.random() * 1000) + 100,
        date: new Date(timestamp)
      };
    });
  };
  
  // Helper to convert interval string to milliseconds
  const getIntervalInMs = (interval: string): number => {
    const unit = interval.slice(-1);
    const value = parseInt(interval.slice(0, -1));
    
    switch(unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000; // Default to 1h
    }
  };
  
  return {
    ...state,
    refreshData,
    refresh, // Alias for refreshData
    checkAPIStatus,
    fetchData,
    handleRetryConnection
  };
};

// Export ApiStatus type for components that need it
export type { ApiStatus } from './trading-chart/types';
