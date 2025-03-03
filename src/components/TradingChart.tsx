
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
        const { data, error } = await supabase.functions.invoke('market-data-collector');
        
        if (error) {
          console.error("API status check failed:", error);
          setApiStatus('unavailable');
          toast({
            title: "API Connection Issue",
            description: "We're having trouble connecting to our trading services. Some features may be limited. Try using Simulation Mode.",
            variant: "destructive",
          });
        } else {
          console.log("API is available:", data);
          setApiStatus('available');
        }
      } catch (error) {
        console.error("Error checking API status:", error);
        setApiStatus('unavailable');
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

  useEffect(() => {
    // Update the trading data every 5 seconds
    const dataInterval = setInterval(() => {
      setData(generateTradingData());
    }, 5000);

    return () => clearInterval(dataInterval);
  }, []);

  return (
    <div className="space-y-6">
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
