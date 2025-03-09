
import { useMarketWebSocket } from "@/hooks/use-market-websocket";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AIMarketAnalysis } from "./market/AIMarketAnalysis";
import { MarketLoading } from "./market/overview/MarketLoading";
import { MarketError } from "./market/overview/MarketError";
import { MarketEmpty } from "./market/overview/MarketEmpty";
import { MarketHeader } from "./market/overview/MarketHeader";
import { MarketTabs } from "./market/overview/MarketTabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { validateMarketData, groupMarketDataByMarket } from "./market/overview/utils/marketDataUtils";

const MarketOverview = () => {
  const { marketData, reconnect, connectionStatus } = useMarketWebSocket();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
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
    if (marketData && marketData.length > 0) {
      const { isValid, errorMessage } = validateMarketData(marketData);
      
      if (!isValid) {
        setErrorMessage(errorMessage);
        setHasError(true);
      } else {
        setHasError(false);
        setErrorMessage("");
      }
    }
  }, [marketData]);

  const fetchAgentAnalysis = useCallback(async () => {
    if (!showAIInsights) return;
    
    try {
      setIsAgentLoading(true);
      const { data, error } = await supabase.functions.invoke('market-analysis', {
        body: { 
          marketData: marketData && marketData.length > 0 ? marketData[0] : null,
          requestType: 'overview'
        }
      });
      
      if (error) {
        console.error('Failed to fetch agent analysis:', error);
        toast({
          title: "AI Analysis Failed",
          description: "Could not load AI market insights. Please try again later.",
          variant: "destructive",
        });
      } else {
        setAgentData(data);
      }
    } catch (error) {
      console.error('Exception fetching agent analysis:', error);
    } finally {
      setIsAgentLoading(false);
    }
  }, [showAIInsights, marketData, toast]);

  // Fetch agent data when AI insights are enabled or market data changes
  useEffect(() => {
    if (showAIInsights && marketData && marketData.length > 0) {
      fetchAgentAnalysis();
    }
  }, [showAIInsights, marketData, fetchAgentAnalysis]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsInitialLoading(true);
    setIsManualRefreshing(true);
    reconnect();
    
    toast({
      title: "Herverbinden...",
      description: "Bezig met het herstellen van de marktdata verbinding",
    });
    
    // Also retry agent data if AI insights are enabled
    if (showAIInsights) {
      fetchAgentAnalysis();
    }
    
    // Reset manual refreshing state after a timeout
    setTimeout(() => {
      setIsManualRefreshing(false);
      setIsInitialLoading(false);
    }, 3000);
  }, [reconnect, toast, showAIInsights, fetchAgentAnalysis]);

  const toggleAIInsights = useCallback(() => {
    const newState = !showAIInsights;
    setShowAIInsights(newState);
    
    toast({
      title: newState ? "AI Insights Enabled" : "AI Insights Disabled",
      description: newState 
        ? "AI-powered market analysis activated" 
        : "Standard market view restored",
      duration: 3000,
    });
    
    if (newState && (!agentData || Object.keys(agentData).length === 0)) {
      fetchAgentAnalysis();
    }
  }, [showAIInsights, agentData, fetchAgentAnalysis, toast]);

  const isLoadingState = isInitialLoading || isManualRefreshing;

  // Early return for initial loading state
  if (isLoadingState) {
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
        
        <div className="flex justify-between items-center mb-6">
          <MarketHeader showAIInsights={showAIInsights} toggleAIInsights={toggleAIInsights} />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            className="ml-auto"
            disabled={isManualRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isManualRefreshing ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
        </div>
        
        {showAIInsights && (
          <div className="mb-6">
            <AIMarketAnalysis 
              marketData={firstMarketData || undefined} 
              analysisData={agentData}
              isLoading={isAgentLoading}
              onRefresh={fetchAgentAnalysis}
              className="h-[300px]"
            />
          </div>
        )}
        
        <MarketTabs 
          groupedData={groupedData} 
          marketOrder={marketOrder} 
          isLoading={isManualRefreshing}
          error={errorMessage}
        />
      </div>
    </div>
  );
};

export default MarketOverview;
