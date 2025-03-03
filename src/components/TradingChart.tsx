
import { useState, useEffect } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { TradingChartContent } from "./trading/TradingChartContent";
import { TradingOrderSection } from "./trading/TradingOrderSection";
import { generateTradingData } from "@/utils/tradingData";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const TradingChart = () => {
  const [data, setData] = useState(generateTradingData());
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const [forceSimulation, setForceSimulation] = useState(false);
  const [lastAPICheckTime, setLastAPICheckTime] = useState<Date | null>(null);

  // Check the API status when the component mounts
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Checking API status...");
        setApiStatus('checking');
        
        // Force API to be available when in simulation mode
        if (forceSimulation) {
          console.log("Simulation mode is active, setting API as available");
          setApiStatus('available');
          return;
        }
        
        // Try to call a simple endpoint to check if the API is available
        const { data, error } = await supabase.functions.invoke('market-data-collector', {
          body: { action: 'status_check' }
        });
        
        if (error) {
          console.error("API status check failed:", error);
          setApiStatus('unavailable');
          setLastAPICheckTime(new Date());
          
          toast({
            title: "API Connection Issue",
            description: "We're having trouble connecting to our trading services. Some features may be limited. Try using Simulation Mode.",
            variant: "destructive",
          });
        } else {
          console.log("API is available:", data);
          setApiStatus('available');
          setLastAPICheckTime(new Date());
        }
      } catch (error) {
        console.error("Error checking API status:", error);
        setApiStatus('unavailable');
        setLastAPICheckTime(new Date());
        
        toast({
          title: "API Connection Failed",
          description: "Unable to connect to trading services. Please try using Simulation Mode.",
          variant: "destructive",
        });
      }
    };

    checkApiStatus();

    // Set up a periodic check every 60 seconds
    const intervalId = setInterval(checkApiStatus, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [forceSimulation]);

  // Handle manual retry for API connection
  const handleRetryConnection = async () => {
    toast({
      title: "Checking Connection",
      description: "Attempting to reconnect to trading services...",
    });
    
    try {
      setApiStatus('checking');
      
      const { data, error } = await supabase.functions.invoke('market-data-collector', {
        body: { action: 'status_check' }
      });
      
      if (error) {
        console.error("Retry API status check failed:", error);
        setApiStatus('unavailable');
        toast({
          title: "Connection Failed",
          description: "Still unable to connect to trading services. Try again later or use Simulation Mode.",
          variant: "destructive",
        });
      } else {
        console.log("API is available after retry:", data);
        setApiStatus('available');
        toast({
          title: "Connection Restored",
          description: "Successfully connected to trading services.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error during retry:", error);
      setApiStatus('unavailable');
      toast({
        title: "Connection Failed",
        description: "Unable to connect to trading services. Try again later or use Simulation Mode.",
        variant: "destructive",
      });
    }
    
    setLastAPICheckTime(new Date());
  };

  useEffect(() => {
    // Update the trading data every 5 seconds
    const dataInterval = setInterval(() => {
      setData(generateTradingData());
    }, 5000);

    return () => clearInterval(dataInterval);
  }, []);

  return (
    <div className="space-y-6">
      {apiStatus === 'unavailable' && (
        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">⚠️</div>
            <div>
              <h3 className="font-medium">Trading Services Unavailable</h3>
              <p className="text-sm text-muted-foreground">
                Using simulation mode is recommended. {lastAPICheckTime && `Last check: ${lastAPICheckTime.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryConnection}
            className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md text-sm font-medium text-yellow-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}
      
      <PriceCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingChartContent 
            scale={scale}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
          />
        </div>

        <TradingOrderSection 
          apiStatus={apiStatus} 
        />
      </div>
    </div>
  );
};

export default TradingChart;
