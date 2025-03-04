
import { useState, useEffect, useCallback } from 'react';
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
  
  const { toast } = useToast();
  
  const fetchMarketData = useCallback(async () => {
    try {
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
      
      if (collectorData && Array.isArray(collectorData)) {
        console.log('Successfully fetched data from market-data-collector:', collectorData.length, 'items');
        setMarketData(collectorData as MarketData[]);
        filterData(collectorData as MarketData[], searchTerm, activeTab);
        
        toast({
          title: 'Market data updated',
          description: `Successfully fetched fallback data for ${collectorData.length} markets`,
          duration: 3000,
        });
      } else {
        // Handle non-array data
        console.error('Invalid market data format from both endpoints:', collectorData);
        throw new Error('Market data format is invalid. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setMarketData([]);
      setFilteredData([]);
      setError(error instanceof Error ? error.message : 'Unknown error fetching market data');
      
      toast({
        title: 'Error',
        description: 'Failed to fetch market data. Please try again later.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, activeTab, toast]);
  
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
    fetchMarketData();
  };
  
  const handleSelectMarket = (market: MarketData) => {
    setSelectedMarket(market);
    setShowMarketDetail(true);
  };
  
  const handleCloseMarketDetail = () => {
    setShowMarketDetail(false);
  };
  
  const getMarketCategories = () => {
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
    setShowMarketDetail,
    handleSearch,
    handleTabChange,
    handleRefresh,
    handleSelectMarket,
    handleCloseMarketDetail,
    getMarketCategories
  };
};
