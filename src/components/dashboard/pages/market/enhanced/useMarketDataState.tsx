
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MarketData } from '@/components/market/types';
import { fetchMarketData } from './api/fetchMarketData';
import { filterMarketData, getMarketCategories as getCategories } from './utils/filterMarketData';

export const useMarketDataState = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [filteredData, setFilteredData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [showMarketDetail, setShowMarketDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  
  // Clear any existing retry timer when component unmounts
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);
  
  const fetchMarketDataWithRetry = useCallback(async (retry = false) => {
    try {
      if (retry) {
        setRetryCount(prev => prev + 1);
      } else {
        setRetryCount(0);
      }
      
      setIsRefreshing(true);
      setError(null);
      
      const result = await fetchMarketData();
      
      setMarketData(result.data);
      filterData(result.data, searchTerm, activeTab);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error in fetchMarketDataWithRetry:', error);
      
      // If we still have retries left, schedule another attempt
      if (retryCount < maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Scheduling retry attempt ${retryCount + 1} in ${retryDelay}ms`);
        
        // Clear any existing retry timer
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
        }
        
        // Set a new retry timer
        retryTimerRef.current = setTimeout(() => {
          console.log(`Executing retry attempt ${retryCount + 1}`);
          fetchMarketDataWithRetry(true);
        }, retryDelay);
        
        setError(`Unable to fetch market data. Retrying in ${retryDelay / 1000} seconds...`);
      } else {
        setError(error instanceof Error 
          ? `${error.message}. Using backup data.` 
          : 'Failed to fetch market data after multiple attempts. Using backup data.'
        );
        
        toast({
          title: 'Using emergency backup data',
          description: 'Could not connect to market data services. Using local backup data instead.',
          variant: 'warning',
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, activeTab, toast, retryCount]);
  
  useEffect(() => {
    fetchMarketDataWithRetry();
    
    // Auto-refresh market data every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchMarketDataWithRetry();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchMarketDataWithRetry]);
  
  const filterData = useCallback((data: MarketData[], search: string, tab: string) => {
    const filtered = filterMarketData(data, search, tab);
    setFilteredData(filtered);
  }, []);
  
  useEffect(() => {
    if (Array.isArray(marketData)) {
      filterData(marketData, searchTerm, activeTab);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, activeTab, marketData, filterData]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleRefresh = () => {
    // Reset retry count when manually refreshing
    setRetryCount(0);
    fetchMarketDataWithRetry();
  };
  
  const handleSelectMarket = (market: MarketData) => {
    setSelectedMarket(market);
    setShowMarketDetail(true);
  };
  
  const handleCloseMarketDetail = () => {
    setShowMarketDetail(false);
  };
  
  const getMarketCategories = useCallback(() => {
    return getCategories(marketData);
  }, [marketData]);

  return {
    marketData,
    filteredData,
    isLoading,
    searchTerm,
    activeTab,
    isRefreshing,
    selectedMarket,
    showMarketDetail,
    error,
    retryCount,
    setShowMarketDetail,
    handleSearch,
    handleTabChange,
    handleRefresh,
    handleSelectMarket,
    handleCloseMarketDetail,
    getMarketCategories
  };
};
