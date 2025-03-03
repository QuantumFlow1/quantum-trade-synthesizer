
import { useState, useEffect } from 'react';
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
  
  const { toast } = useToast();
  
  const fetchMarketData = async () => {
    try {
      setIsRefreshing(true);
      // Use supabase client to call the market-data-collector function
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        throw new Error(`Failed to fetch market data: ${error.message}`);
      }
      
      if (data) {
        setMarketData(data as MarketData[]);
        filterData(data as MarketData[], searchTerm, activeTab);
        
        toast({
          title: 'Market data updated',
          description: `Successfully fetched data for ${data.length} markets`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
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
  };
  
  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh market data every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchMarketData();
    }, 60000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const filterData = (data: MarketData[], search: string, tab: string) => {
    let filtered = [...data];
    
    // Apply search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        item => item.symbol.toLowerCase().includes(searchLower) || 
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
    filterData(marketData, searchTerm, activeTab);
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
    marketData.forEach(item => {
      if (item.market) {
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
    setShowMarketDetail,
    handleSearch,
    handleTabChange,
    handleRefresh,
    handleSelectMarket,
    handleCloseMarketDetail,
    getMarketCategories
  };
};
