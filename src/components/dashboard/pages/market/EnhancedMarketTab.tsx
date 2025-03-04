
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MarketTabList activeTab={activeTab} />

        <TabsContent value="market" className="mt-6">
          <ErrorBoundary 
            fallback={
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
            }
          >
            <EnhancedMarketPage />
          </ErrorBoundary>
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
      </Tabs>
    </div>
  );
};

// Enhanced error boundary component with reset capability
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { 
    hasError: false,
    error: null,
    errorInfo: null 
  };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error details for debugging
    console.error("Error in market component:", error);
    console.error("Component stack:", errorInfo?.componentStack);
    this.setState({ errorInfo });
  }

  // Method to reset the error boundary
  resetErrorBoundary = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      // Try to recover automatically after 10 seconds
      setTimeout(() => {
        this.resetErrorBoundary();
      }, 10000);
      
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}
