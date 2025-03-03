
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, RefreshCw, TrendingUp, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketData } from '@/components/market/types';
import { EnhancedMarketDataTable } from '@/components/market/EnhancedMarketDataTable';
import { MarketTrendsAnalysis } from '@/components/market/MarketTrendsAnalysis';
import { EnhancedMarketDetail } from '@/components/market/EnhancedMarketDetail';
import { MarketCharts } from '@/components/market/MarketCharts';
import { supabase } from '@/lib/supabase';

export const EnhancedMarketPage: React.FC = () => {
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
  
  const getTopPerformers = (): MarketData[] => {
    return [...marketData]
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
      .slice(0, 5);
  };
  
  const getTopVolume = (): MarketData[] => {
    return [...marketData]
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 5);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Market Overview</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-60">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search markets..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Top Performers (24h)
                </h2>
                <MarketCharts data={getTopPerformers()} isLoading={isLoading} type="price" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Top Volume (24h)
                </h2>
                <MarketCharts data={getTopVolume()} isLoading={isLoading} type="volume" />
              </CardContent>
            </Card>
          </div>
          
          <MarketTrendsAnalysis marketData={marketData} />
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList className="mb-4 flex overflow-x-auto">
              <TabsTrigger value="all">All Markets</TabsTrigger>
              {getMarketCategories().map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab}>
              <EnhancedMarketDataTable 
                data={filteredData} 
                onSelectMarket={handleSelectMarket} 
              />
            </TabsContent>
          </Tabs>
          
          <Dialog open={showMarketDetail} onOpenChange={setShowMarketDetail}>
            <DialogContent className="max-w-4xl">
              {selectedMarket && (
                <EnhancedMarketDetail 
                  marketData={selectedMarket} 
                  onClose={handleCloseMarketDetail} 
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
