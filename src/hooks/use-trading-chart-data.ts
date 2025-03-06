
import { useState, useEffect, useCallback } from "react";
import { generateTradingData, TradingDataPoint } from "@/utils/tradingData";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { loadApiKeysFromStorage } from "@/components/chat/api-keys/apiKeyUtils";

export type ApiStatus = 'checking' | 'available' | 'unavailable';

export function useTradingChartData(forceSimulation: boolean) {
  const [data, setData] = useState(generateTradingData());
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [lastAPICheckTime, setLastAPICheckTime] = useState<Date | null>(null);
  const [apiKeysAvailable, setApiKeysAvailable] = useState<boolean>(false);
  const [rawMarketData, setRawMarketData] = useState<any>(null);

  const checkApiKeysAvailability = useCallback(() => {
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
        
        const keysAvailable = hasUserKeys || hasAdminKeys;
        setApiKeysAvailable(keysAvailable);
        return keysAvailable;
      } catch (err) {
        console.error("Exception checking admin API keys:", err);
        setApiKeysAvailable(hasUserKeys);
        return hasUserKeys;
      }
    };
    
    return checkAdminKeys();
  }, []);

  const formatMarketData = (apiData: any[]): TradingDataPoint[] => {
    if (!apiData || !Array.isArray(apiData)) {
      console.error("Invalid market data received:", apiData);
      return generateTradingData(); // Fallback to generated data
    }
    
    try {
      const mainAsset = apiData[0] || {};
      
      const formattedData = generateTradingData().map((item, index) => {
        const trendValue: "up" | "down" | "neutral" = 
          mainAsset.change24h !== undefined 
            ? (mainAsset.change24h >= 0 ? "up" : "down") 
            : item.trend;
            
        return {
          ...item,
          open: mainAsset.price ? mainAsset.price * (0.99 + Math.random() * 0.02) : item.open,
          close: mainAsset.price || item.close,
          high: mainAsset.high24h || (mainAsset.price ? mainAsset.price * 1.02 : item.high),
          low: mainAsset.low24h || (mainAsset.price ? mainAsset.price * 0.98 : item.low),
          volume: mainAsset.volume24h || item.volume,
          trend: trendValue
        };
      });
      
      return formattedData;
    } catch (error) {
      console.error("Error formatting market data:", error);
      return generateTradingData(); // Fallback to generated data
    }
  };

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
        
        const { data: validationResult, error: validationError } = await supabase.functions.invoke('market-data-validator', {
          body: { marketData, source: 'market-data-collector' }
        });
        
        if (validationError) {
          console.error("Error validating market data:", validationError);
          const formattedData = formatMarketData(marketData);
          setData(formattedData);
          return formattedData;
        }
        
        if (validationResult && validationResult.valid && validationResult.data) {
          console.log("Using validated market data");
          setData(validationResult.data);
          return validationResult.data;
        } else {
          console.warn("Validation service returned invalid data, falling back to local formatting");
          const formattedData = formatMarketData(marketData);
          setData(formattedData);
          return formattedData;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error in fetchMarketData:", error);
      const fallbackData = generateTradingData();
      setData(fallbackData);
      return fallbackData;
    }
  };

  const checkApiStatus = useCallback(async () => {
    try {
      console.log("Checking API status...");
      setApiStatus('checking');
      
      if (forceSimulation) {
        console.log("Simulation mode is active, setting API as available");
        setApiStatus('available');
        return;
      }
      
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
  }, [forceSimulation, checkApiKeysAvailability, fetchMarketData]);

  const handleRetryConnection = async () => {
    toast({
      title: "Checking Connection",
      description: "Attempting to reconnect to trading services...",
    });
    
    try {
      setApiStatus('checking');
      
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

  // Initial API check
  useEffect(() => {
    checkApiStatus();
    const intervalId = setInterval(checkApiStatus, 60000);
    return () => clearInterval(intervalId);
  }, [forceSimulation, checkApiStatus]);

  // Regular data update interval
  useEffect(() => {
    const dataInterval = setInterval(() => {
      if (forceSimulation) {
        setData(generateTradingData());
      } else if (apiStatus === 'available') {
        fetchMarketData();
      }
    }, 5000);

    return () => clearInterval(dataInterval);
  }, [forceSimulation, apiStatus, fetchMarketData]);

  return {
    data,
    apiStatus,
    apiKeysAvailable,
    lastAPICheckTime,
    rawMarketData,
    handleRetryConnection,
    fetchMarketData
  };
}
