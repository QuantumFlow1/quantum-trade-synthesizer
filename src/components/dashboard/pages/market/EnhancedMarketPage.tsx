
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MarketTrendsAnalysis } from '@/components/market/MarketTrendsAnalysis';
import { EnhancedMarketDataTable } from '@/components/market/EnhancedMarketDataTable';
import { MarketHeader } from './enhanced/MarketHeader';
import { MarketTrendCards } from './enhanced/MarketTrendCards';
import { MarketTabList } from './enhanced/MarketTabList';
import { MarketDetailsDialog } from './enhanced/MarketDetailsDialog';
import { LoadingState } from './enhanced/LoadingState';
import { useMarketDataState } from './enhanced/useMarketDataState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, WifiOff, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExtendedDataAlert } from '@/components/trading/charts/ExtendedDataAlert';

export const EnhancedMarketPage: React.FC = () => {
  const {
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
  } = useMarketDataState();
  
  // Online status tracking
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  React.useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if we have valid market data
  const hasValidData = Array.isArray(marketData) && marketData.length > 0;
  
  // Get market categories with error handling
  const categories = React.useMemo(() => {
    try {
      return getMarketCategories();
    } catch (err) {
      console.error("Error getting market categories:", err);
      return [];
    }
  }, [marketData, getMarketCategories]);

  return (
    <div className="space-y-6 relative">
      {!isOnline && (
        <Alert variant="warning" className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>You're currently offline. Some features may be limited or using cached data.</p>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span>Reconnecting automatically when network is available</span>
              <span className="ml-2 flex-shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {isOnline && retryCount > 0 && (
        <Alert variant="warning" className="mb-4">
          <Wifi className="h-4 w-4" />
          <AlertTitle>Reconnecting to market data</AlertTitle>
          <AlertDescription className="flex items-center">
            <p>Attempt {retryCount} of 3...</p>
            <span className="ml-2 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
            </span>
          </AlertDescription>
        </Alert>
      )}
      
      <MarketHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : !hasValidData ? (
        <Alert variant={error ? "destructive" : "warning"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading market data</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error || "We couldn't load the market data. This might be a temporary issue."}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <MarketTrendCards 
            marketData={marketData} 
            isLoading={isLoading} 
          />
          
          <MarketTrendsAnalysis marketData={marketData} />
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <MarketTabList 
              activeTab={activeTab} 
              marketCategories={categories} 
            />
            
            <TabsContent value={activeTab} className="mt-2">
              <EnhancedMarketDataTable 
                data={filteredData || []} 
                onSelectMarket={handleSelectMarket} 
              />
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-2">
                <EnhancedMarketDataTable 
                  data={filteredData || []} 
                  onSelectMarket={handleSelectMarket} 
                />
              </TabsContent>
            ))}
          </Tabs>
          
          <MarketDetailsDialog
            selectedMarket={selectedMarket}
            showMarketDetail={showMarketDetail}
            setShowMarketDetail={setShowMarketDetail}
            handleCloseMarketDetail={handleCloseMarketDetail}
          />
        </>
      )}
    </div>
  );
};
