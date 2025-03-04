
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
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    setShowMarketDetail,
    handleSearch,
    handleTabChange,
    handleRefresh,
    handleSelectMarket,
    handleCloseMarketDetail,
    getMarketCategories
  } = useMarketDataState();

  // Check if we have valid market data
  const hasValidData = Array.isArray(marketData) && marketData.length > 0;
  const categories = React.useMemo(() => {
    try {
      return getMarketCategories();
    } catch (err) {
      console.error("Error getting market categories:", err);
      return [];
    }
  }, [marketData, getMarketCategories]);

  return (
    <div className="space-y-6">
      <MarketHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : !hasValidData ? (
        <Alert variant="destructive">
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
