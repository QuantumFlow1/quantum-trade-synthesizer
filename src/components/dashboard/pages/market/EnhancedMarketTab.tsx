
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { EnhancedMarketPage } from '@/components/dashboard/pages/market/EnhancedMarketPage';
import { MarketTabList } from './tabs/MarketTabList';
import { PositionsTab } from './tabs/PositionsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { useMarketTabState } from './hooks/useMarketTabState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const handleRefresh = () => {
    window.location.reload();
  };

  // Render error message in a card instead of using an error boundary
  const renderErrorState = () => (
    <Card className="w-full overflow-hidden border bg-background">
      <CardContent className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading market data</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>We encountered an issue with the market data.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="w-fit"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  // Handle tab changes explicitly
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <MarketTabList activeTab={activeTab} />

        <ScrollArea className="h-[calc(100vh-250px)]">
          <TabsContent value="market" className="mt-6">
            <EnhancedMarketPage />
          </TabsContent>

          <TabsContent value="positions" className="mt-6">
            <PositionsTab 
              positions={positions || []}
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
        </ScrollArea>
      </Tabs>
    </div>
  );
};
