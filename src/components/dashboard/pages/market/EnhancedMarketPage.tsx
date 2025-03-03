
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
    setShowMarketDetail,
    handleSearch,
    handleTabChange,
    handleRefresh,
    handleSelectMarket,
    handleCloseMarketDetail,
    getMarketCategories
  } = useMarketDataState();

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
              marketCategories={getMarketCategories()} 
            />
            
            <TabsContent value={activeTab}>
              <EnhancedMarketDataTable 
                data={filteredData} 
                onSelectMarket={handleSelectMarket} 
              />
            </TabsContent>
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
