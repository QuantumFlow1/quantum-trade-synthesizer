
import { useState, useEffect } from "react";
import MarketOverview from "@/components/MarketOverview";
import { Card } from "@/components/ui/card";
import { Activity, AlertCircle, RefreshCcw } from "lucide-react";
import UserSentimentAnalysis from "@/components/user/UserSentimentAnalysis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMarketWebSocket } from "@/hooks/use-market-websocket";

export const MarketPage = () => {
  const { marketData, connectionStatus, reconnect } = useMarketWebSocket();
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    // Set initial loading state
    setLoadingState('loading');
    
    // Set a timeout to check if data was loaded
    const timer = setTimeout(() => {
      if (connectionStatus === 'connected' && marketData && marketData.length > 0) {
        setLoadingState('success');
      } else if (connectionStatus === 'disconnected') {
        setLoadingState('error');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [marketData, connectionStatus]);

  // Handle manual refresh of market data
  const handleRefresh = () => {
    setLoadingState('loading');
    reconnect();
    toast({
      title: "Refreshing market data",
      description: "Attempting to reconnect to market data service..."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Activity className="w-5 h-5 mr-2" /> Market Overview
          </h2>
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <span className="text-sm text-green-500 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Connected
              </span>
            ) : connectionStatus === 'connecting' ? (
              <span className="text-sm text-yellow-500 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                Connecting...
              </span>
            ) : (
              <span className="text-sm text-red-500 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Disconnected
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loadingState === 'loading'}
              className="ml-2"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loadingState === 'error' && !marketData?.length && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Failed to connect to market data service. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        )}

        <MarketOverview />
      </Card>

      <div className="w-full">
        <UserSentimentAnalysis />
      </div>
    </div>
  );
};
