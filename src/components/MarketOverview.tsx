
import { useMarketWebSocket } from "@/hooks/use-market-websocket";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIMarketAnalysis } from "./market/AIMarketAnalysis";
import { MarketLoading } from "./market/overview/MarketLoading";
import { MarketError } from "./market/overview/MarketError";
import { MarketEmpty } from "./market/overview/MarketEmpty";
import { MarketHeader } from "./market/overview/MarketHeader";
import { MarketTabs } from "./market/overview/MarketTabs";
import { validateMarketData, groupMarketDataByMarket } from "./market/overview/utils/marketDataUtils";

const MarketOverview = () => {
  const { marketData, reconnect, connectionStatus } = useMarketWebSocket();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const { toast } = useToast();

  // Set a longer initial loading state to ensure data is properly fetched
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Data validation and error handling
    const { isValid, errorMessage } = validateMarketData(marketData);
    
    if (!isValid) {
      setErrorMessage(errorMessage);
      setHasError(true);
    } else {
      setHasError(false);
      setErrorMessage("");
    }
  }, [marketData]);

  const handleRetry = () => {
    setHasError(false);
    setIsInitialLoading(true);
    reconnect();
    toast({
      title: "Herverbinden...",
      description: "Bezig met het herstellen van de marktdata verbinding",
    });
  };

  const toggleAIInsights = () => {
    setShowAIInsights(!showAIInsights);
    toast({
      title: showAIInsights ? "AI Insights Disabled" : "AI Insights Enabled",
      description: showAIInsights 
        ? "Standard market view restored" 
        : "AI-powered market analysis activated",
      duration: 3000,
    });
  };

  // Early return for initial loading state
  if (isInitialLoading) {
    return <MarketLoading />;
  }

  // Error state with retry button
  if (hasError || connectionStatus === 'disconnected') {
    return <MarketError errorMessage={errorMessage} onRetry={handleRetry} />;
  }

  // If no data after initial loading, show message
  if (!marketData || marketData.length === 0) {
    return <MarketEmpty onRetry={handleRetry} />;
  }

  // Group data by market for tabs
  const groupedData = groupMarketDataByMarket(marketData);
  const marketOrder = ['NYSE', 'NASDAQ', 'AEX', 'DAX', 'CAC40', 'NIKKEI', 'HSI', 'SSE', 'Crypto'];

  // Get the first available market data for AI analysis
  const firstMarketData = marketData.length > 0 ? marketData[0] : null;

  return (
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg will-change-transform hover:shadow-xl transition-all duration-300 ease-out">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
        
        <MarketHeader showAIInsights={showAIInsights} toggleAIInsights={toggleAIInsights} />
        
        {showAIInsights && (
          <div className="mb-6">
            <AIMarketAnalysis 
              marketData={firstMarketData || undefined} 
              className="h-[300px]"
            />
          </div>
        )}
        
        <MarketTabs groupedData={groupedData} marketOrder={marketOrder} />
      </div>
    </div>
  );
};

export default MarketOverview;
