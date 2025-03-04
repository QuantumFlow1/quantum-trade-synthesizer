
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { EnhancedMarketPage } from '@/components/dashboard/pages/market/EnhancedMarketPage';
import { MarketTabList } from './tabs/MarketTabList';
import { PositionsTab } from './tabs/PositionsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { useMarketTabState } from './hooks/useMarketTabState';

export const EnhancedMarketTab: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    positions,
    isLoading,
    showCharts,
    toggleChartsVisibility,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage
  } = useMarketTabState();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MarketTabList activeTab={activeTab} />

        <TabsContent value="market" className="mt-6">
          <EnhancedMarketPage />
        </TabsContent>

        <TabsContent value="positions" className="mt-6">
          <PositionsTab 
            positions={positions}
            isLoading={isLoading}
            showCharts={showCharts}
            toggleChartsVisibility={toggleChartsVisibility}
          />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
