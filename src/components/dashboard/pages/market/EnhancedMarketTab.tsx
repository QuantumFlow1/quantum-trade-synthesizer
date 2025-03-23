
import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MarketTabList } from "./tabs/MarketTabList";
import { EnhancedMarketPage } from "./enhanced/EnhancedMarketPage";
import { MarketPositionsPage } from "./positions/MarketPositionsPage";
import { MarketTransactionsPage } from "./transactions/MarketTransactionsPage";
import { useMarketDataState } from "./enhanced/useMarketDataState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketSummaryBanner } from "./enhanced/MarketSummaryBanner";

export const EnhancedMarketTab = () => {
  const [activeTab, setActiveTab] = useState("market");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const {
    marketData,
    filteredData,
    isLoading,
    error,
    isRefreshing,
    handleRefresh
  } = useMarketDataState();

  // Handle tab changes explicitly
  const handleTabChange = (value: string) => {
    console.log("Enhanced market tab changed to:", value);
    setActiveTab(value);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };
  
  // Display error if there's an issue loading market data
  if (error && !isRefreshing) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            className="w-fit mt-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {/* Added Market Summary Banner for professional overview */}
      <MarketSummaryBanner marketData={marketData} isLoading={isLoading} />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <MarketTabList activeTab={activeTab} />

        <div className="h-[calc(100vh-320px)] overflow-auto">
          <TabsContent value="market" className="mt-6">
            <EnhancedMarketPage />
          </TabsContent>

          <TabsContent value="positions" className="mt-6">
            {activeTab === "positions" && (
              <MarketPositionsPage 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
              />
            )}
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            {activeTab === "transactions" && (
              <MarketTransactionsPage 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
