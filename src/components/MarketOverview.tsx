
import { Tabs } from "@/components/ui/tabs";
import { useMarketOverview } from "./market/overview/useMarketOverview";
import { LoadingState } from "./market/overview/LoadingState";
import { ErrorState } from "./market/overview/ErrorState";
import { NoDataState } from "./market/overview/NoDataState";
import { MarketTabsList } from "./market/overview/MarketTabsList";
import { MarketTabContent } from "./market/overview/MarketTabContent";

const MarketOverview = () => {
  const {
    marketData,
    groupedData,
    marketOrder,
    isInitialLoading,
    hasError,
    errorMessage,
    connectionStatus,
    handleRetry,
  } = useMarketOverview();

  // Early return for initial loading state
  if (isInitialLoading) {
    return <LoadingState />;
  }

  // Error state with retry button
  if (hasError || connectionStatus === 'disconnected') {
    return <ErrorState errorMessage={errorMessage} onRetry={handleRetry} />;
  }

  // If no data after initial loading, show message
  if (!marketData || !marketData.length) {
    return <NoDataState onRefresh={handleRetry} />;
  }

  // Find the first available market to use as default tab
  const defaultMarket = marketOrder.find(market => groupedData[market]?.length > 0) || marketOrder[0];

  return (
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg will-change-transform hover:shadow-xl transition-all duration-300 ease-out">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
        
        <h2 className="relative text-2xl font-semibold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Wereldwijde Markten
        </h2>
        
        <Tabs defaultValue={defaultMarket} className="w-full">
          <MarketTabsList marketOrder={marketOrder} groupedData={groupedData} />

          <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
            {marketOrder.map((market) => (
              groupedData[market]?.length > 0 && (
                <MarketTabContent 
                  key={market} 
                  market={market} 
                  data={groupedData[market]} 
                  isLoading={!marketData.length} 
                />
              )
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketOverview;
