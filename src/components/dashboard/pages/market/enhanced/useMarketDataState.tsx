
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MarketData } from '@/components/market/types';
import { supabase } from '@/lib/supabase';

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
  
  const fetchMarketData = useCallback(async (retry = false) => {
    try {
      if (retry) {
        setRetryCount(prev => prev + 1);
      } else {
        setRetryCount(0);
      }
      
      setIsRefreshing(true);
      setError(null);
      
      console.log('Fetching market data...');
      
      // First try fetch-market-data function which has more detailed data
      const { data: fetchData, error: fetchError } = await supabase.functions.invoke('fetch-market-data');
      
      if (fetchError) {
        console.error('Error from fetch-market-data:', fetchError);
        throw new Error(`Failed to fetch market data: ${fetchError.message}`);
      }
      
      if (fetchData && Array.isArray(fetchData) && fetchData.length > 0) {
        console.log('Successfully fetched data from fetch-market-data:', fetchData.length, 'items');
        setMarketData(fetchData as MarketData[]);
        filterData(fetchData as MarketData[], searchTerm, activeTab);
        
        toast({
          title: 'Market data updated',
          description: `Successfully fetched data for ${fetchData.length} markets`,
          duration: 3000,
        });
        return;
      }
      
      // If that fails, try the market-data-collector as fallback
      console.log('No data from fetch-market-data, trying market-data-collector...');
      const { data: collectorData, error: collectorError } = await supabase.functions.invoke('market-data-collector');
      
      if (collectorError) {
        console.error('Error from market-data-collector:', collectorError);
        throw new Error(`Fallback data fetch failed: ${collectorError.message}`);
      }
      
      if (collectorData && Array.isArray(collectorData?.data)) {
        console.log('Successfully fetched data from market-data-collector:', collectorData.data.length, 'items');
        setMarketData(collectorData.data as MarketData[]);
        filterData(collectorData.data as MarketData[], searchTerm, activeTab);
        
        toast({
          title: 'Market data updated',
          description: `Successfully fetched fallback data for ${collectorData.data.length} markets`,
          duration: 3000,
        });
      } else if (collectorData && typeof collectorData === 'object') {
        // Create some emergency backup market data if nothing else works
        const emergencyData = generateEmergencyMarketData();
        console.warn('Using emergency generated market data');
        setMarketData(emergencyData);
        filterData(emergencyData, searchTerm, activeTab);
        
        toast({
          title: 'Using backup market data',
          description: 'Using locally generated data as fallback',
          variant: 'warning',
          duration: 5000,
        });
      } else {
        // Handle non-array data
        console.error('Invalid market data format from both endpoints:', collectorData);
        throw new Error('Market data format is invalid. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      
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
          fetchMarketData(true);
        }, retryDelay);
        
        setError(`Unable to fetch market data. Retrying in ${retryDelay / 1000} seconds...`);
      } else {
        // We've exhausted our retries, use emergency data
        const emergencyData = generateEmergencyMarketData();
        console.warn('Using emergency generated market data after failed retries');
        setMarketData(emergencyData);
        filterData(emergencyData, searchTerm, activeTab);
        
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
    fetchMarketData();
    
    // Auto-refresh market data every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchMarketData();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchMarketData]);
  
  const filterData = (data: MarketData[], search: string, tab: string) => {
    if (!Array.isArray(data)) {
      console.error('filterData received non-array data:', data);
      setFilteredData([]);
      return;
    }
    
    let filtered = [...data];
    
    // Apply search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        item => item.symbol?.toLowerCase().includes(searchLower) || 
        (item.name && item.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply tab filter
    if (tab !== 'all') {
      filtered = filtered.filter(item => item.market === tab);
    }
    
    setFilteredData(filtered);
  };
  
  useEffect(() => {
    if (Array.isArray(marketData)) {
      filterData(marketData, searchTerm, activeTab);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, activeTab, marketData]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleRefresh = () => {
    // Reset retry count when manually refreshing
    setRetryCount(0);
    fetchMarketData();
  };
  
  const handleSelectMarket = (market: MarketData) => {
    setSelectedMarket(market);
    setShowMarketDetail(true);
  };
  
  const handleCloseMarketDetail = () => {
    setShowMarketDetail(false);
  };
  
  const getMarketCategories = useCallback(() => {
    const categories = new Set<string>();
    
    if (!Array.isArray(marketData) || marketData.length === 0) {
      return [];
    }
    
    marketData.forEach(item => {
      if (item && item.market) {
        categories.add(item.market);
      }
    });
    
    return Array.from(categories);
  }, [marketData]);

  // Generate emergency market data as a last resort
  const generateEmergencyMarketData = (): MarketData[] => {
    const markets = ['NYSE', 'NASDAQ', 'Crypto', 'AEX', 'DAX'];
    const symbols = [
      { market: 'NYSE', symbol: 'AAPL', name: 'Apple Inc.', basePrice: 180 },
      { market: 'NYSE', symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 390 },
      { market: 'NASDAQ', symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 142 },
      { market: 'NASDAQ', symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 175 },
      { market: 'Crypto', symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 45000 },
      { market: 'Crypto', symbol: 'ETH/USD', name: 'Ethereum', basePrice: 2500 },
      { market: 'AEX', symbol: 'ASML', name: 'ASML Holding NV', basePrice: 850 },
      { market: 'DAX', symbol: 'SAP', name: 'SAP SE', basePrice: 175 },
    ];
    
    return symbols.map(({ market, symbol, name, basePrice }) => {
      // Generate random price within a range
      const randomFactor = 0.95 + Math.random() * 0.1;
      const price = basePrice * randomFactor;
      
      const change24h = parseFloat(((randomFactor - 1) * 100).toFixed(2));
      
      return {
        market,
        symbol,
        name,
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000 + 1000000),
        change24h,
        high24h: parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2)),
        low24h: parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2)),
        marketCap: parseFloat((price * (Math.random() * 1000000000 + 100000000)).toFixed(2)),
        timestamp: Date.now(),
        totalVolume24h: Math.floor(Math.random() * 10000000 + 1000000),
        circulatingSupply: Math.floor(Math.random() * 1000000000 + 100000000),
        lastUpdated: new Date().toISOString()
      };
    });
  };

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
