
import { useState, useEffect, useCallback } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { TradingChartContent } from "./trading/TradingChartContent";
import { TradingOrderSection } from "./trading/TradingOrderSection";
import { generateTradingData } from "@/utils/tradingData";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { loadApiKeysFromStorage } from "@/components/chat/api-keys/apiKeyUtils";

// Helper function to format market data to expected format
const formatMarketData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.error("Invalid market data received:", apiData);
    return generateTradingData(); // Fallback to generated data
  }
  
  // Convert the API response to the expected format
  try {
    // Extract the first item (usually BTC) as our main trading asset
    const mainAsset = apiData[0] || {};
    
    // Generate compatible trading data format based on actual market data
    const formattedData = generateTradingData().map((item, index) => {
      return {
        ...item,
        // Use actual price data if available
        open: mainAsset.price ? mainAsset.price * (0.99 + Math.random() * 0.02) : item.open,
        close: mainAsset.price || item.close,
        high: mainAsset.high24h || (mainAsset.price ? mainAsset.price * 1.02 : item.high),
        low: mainAsset.low24h || (mainAsset.price ? mainAsset.price * 0.98 : item.low),
        volume: mainAsset.volume24h || item.volume,
        trend: mainAsset.change24h >= 0 ? "up" : "down"
      };
    });
    
    return formattedData;
  } catch (error) {
    console.error("Error formatting market data:", error);
    return generateTradingData(); // Fallback to generated data
  }
};

const TradingChart = () => {
  const [data, setData] = useState(generateTradingData());
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const [forceSimulation, setForceSimulation] = useState(false);
  const [lastAPICheckTime, setLastAPICheckTime] = useState<Date | null>(null);
  const [apiKeysAvailable, setApiKeysAvailable] = useState<boolean>(false);
  const [rawMarketData, setRawMarketData] = useState<any>(null);

  // Check if any API keys are configured
  const checkApiKeysAvailability = useCallback(() => {
    // Check for user-set API keys in localStorage
    const userKeys = loadApiKeysFromStorage();
    const hasUserKeys = !!(userKeys.openaiApiKey || userKeys.claudeApiKey || 
                         userKeys.geminiApiKey || userKeys.deepseekApiKey);
    
    console.log("User API keys availability check:", {
      openai: !!userKeys.openaiApiKey,
      claude: !!userKeys.claudeApiKey,
      gemini: !!userKeys.geminiApiKey,
      deepseek: !!userKeys.deepseekApiKey,
      hasAnyKey: hasUserKeys
    });
    
    // Also check for admin-set API keys in Supabase
    const checkAdminKeys = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { service: 'grok3', checkSecret: true }
        });
        
        if (error) {
          console.error("Error checking admin API keys:", error);
          return false;
        }
        
        const hasAdminKeys = data?.secretSet === true;
        console.log("Admin API keys availability:", hasAdminKeys);
        
        // Update state with combined result
        const keysAvailable = hasUserKeys || hasAdminKeys;
        setApiKeysAvailable(keysAvailable);
        return keysAvailable;
      } catch (err) {
        console.error("Exception checking admin API keys:", err);
        // If we can't check admin keys, fall back to user keys only
        setApiKeysAvailable(hasUserKeys);
        return hasUserKeys;
      }
    };
    
    return checkAdminKeys();
  }, []);

  // Fetch market data from API
  const fetchMarketData = async () => {
    try {
      if (forceSimulation) {
        const generatedData = generateTradingData();
        setData(generatedData);
        return generatedData;
      }
      
      const { data: marketData, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        console.error("Error fetching market data:", error);
        const fallbackData = generateTradingData();
        setData(fallbackData);
        return fallbackData;
      }
      
      if (marketData) {
        console.log("Raw market data received:", marketData);
        setRawMarketData(marketData);
        
        // Format the data to match expected format
        const formattedData = formatMarketData(marketData);
        setData(formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error) {
      console.error("Error in fetchMarketData:", error);
      const fallbackData = generateTradingData();
      setData(fallbackData);
      return fallbackData;
    }
  };

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
        
        // First check if any API keys are configured
        const hasApiKeys = await checkApiKeysAvailability();
        
        if (!hasApiKeys) {
          console.log("No API keys available, setting API as unavailable");
          setApiStatus('unavailable');
          setLastAPICheckTime(new Date());
          
          toast({
            title: "API Keys Missing",
            description: "No API keys configured. Please set up API keys in settings or admin panel.",
            variant: "destructive",
          });
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
          
          // Fetch initial market data
          await fetchMarketData();
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
  }, [forceSimulation, checkApiKeysAvailability]);

  // Handle manual retry for API connection
  const handleRetryConnection = async () => {
    toast({
      title: "Checking Connection",
      description: "Attempting to reconnect to trading services...",
    });
    
    try {
      setApiStatus('checking');
      
      // First ensure we have API keys configured
      const hasApiKeys = await checkApiKeysAvailability();
      
      if (!hasApiKeys) {
        setApiStatus('unavailable');
        toast({
          title: "API Keys Missing",
          description: "No API keys configured. Please set up API keys in settings or admin panel.",
          variant: "destructive",
        });
        setLastAPICheckTime(new Date());
        return;
      }
      
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
        
        // Fetch fresh market data
        await fetchMarketData();
        
        toast({
          title: "Connection Restored",
          description: "Successfully connected to trading services.",
          variant: "default",
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

  // Toggle simulation mode
  const toggleSimulationMode = (enabled: boolean) => {
    setForceSimulation(enabled);
    
    if (enabled) {
      setApiStatus('available');
      toast({
        title: "Simulation Mode Enabled",
        description: "Using simulated data for trading functionality.",
        variant: "default",
      });
    } else {
      // Re-check API status when disabling simulation
      handleRetryConnection();
    }
  };

  useEffect(() => {
    // Update the trading data every 5 seconds
    const dataInterval = setInterval(() => {
      if (forceSimulation) {
        setData(generateTradingData());
      } else if (apiStatus === 'available') {
        fetchMarketData();
      }
    }, 5000);

    return () => clearInterval(dataInterval);
  }, [forceSimulation, apiStatus]);

  return (
    <div className="space-y-6">
      {apiStatus === 'unavailable' && (
        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">⚠️</div>
            <div>
              <h3 className="font-medium">Trading Services Unavailable</h3>
              <p className="text-sm text-muted-foreground">
                {!apiKeysAvailable 
                  ? "No API keys configured. Please set up API keys in settings or admin panel."
                  : "Connection to trading services failed."
                } {lastAPICheckTime && `Last check: ${lastAPICheckTime.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!apiKeysAvailable && (
              <button
                onClick={() => document.getElementById('api-keys-config-btn')?.click()}
                className="px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded-md text-sm font-medium text-primary-foreground transition-colors"
              >
                Configure API Keys
              </button>
            )}
            <button
              onClick={handleRetryConnection}
              className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md text-sm font-medium text-yellow-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
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
          marketData={rawMarketData}
          onSimulationToggle={toggleSimulationMode}
          isSimulationMode={forceSimulation}
          apiKeysAvailable={apiKeysAvailable}
        />
      </div>
    </div>
  );
};

export default TradingChart;
