
import { ApiStatus } from "./types";
import { checkApiKeysAvailability } from "./api-key-manager";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Handles checking API status and managing connection state
 */
export const checkApiStatus = async (
  setApiStatus: (status: ApiStatus) => void,
  setLastAPICheckTime: (time: Date) => void,
  setApiKeysAvailable: (available: boolean) => void,
  forceSimulation: boolean,
  lastAPICheckTime: Date | null,
  fetchMarketData: () => Promise<any>
): Promise<void> => {
  try {
    console.log("Checking API status...");
    setApiStatus('checking');
    
    if (forceSimulation) {
      console.log("Simulation mode is active, setting API as available");
      setApiStatus('available');
      return;
    }
    
    const hasApiKeys = await checkApiKeysAvailability();
    setApiKeysAvailable(hasApiKeys);
    
    if (!hasApiKeys) {
      console.log("No API keys available, setting API as unavailable");
      setApiStatus('unavailable');
      setLastAPICheckTime(new Date());
      
      // Only show toast if this is the first check
      if (!lastAPICheckTime) {
        toast({
          title: "API Keys Missing",
          description: "No API keys configured. Please set up API keys in settings or admin panel.",
          variant: "destructive",
        });
      }
      return;
    }
    
    const { data, error } = await supabase.functions.invoke('market-data-collector', {
      body: { action: 'status_check' }
    });
    
    if (error) {
      console.error("API status check failed:", error);
      setApiStatus('unavailable');
      setLastAPICheckTime(new Date());
      
      // Only show toast if this is the first check
      if (!lastAPICheckTime) {
        toast({
          title: "API Connection Issue",
          description: "We're having trouble connecting to our trading services. Some features may be limited. Try using Simulation Mode.",
          variant: "destructive",
        });
      }
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
    
    // Only show toast if this is the first check
    if (!lastAPICheckTime) {
      toast({
        title: "API Connection Failed",
        description: "Unable to connect to trading services. Please try using Simulation Mode.",
        variant: "destructive",
      });
    }
  }
};

/**
 * Handles retrying API connection
 */
export const retryConnection = async (
  setApiStatus: (status: ApiStatus) => void,
  setLastAPICheckTime: (time: Date) => void,
  checkApiKeysAvailability: () => Promise<boolean>,
  setApiKeysAvailable: (available: boolean) => void,
  fetchMarketData: () => Promise<any>
): Promise<void> => {
  toast({
    title: "Checking Connection",
    description: "Attempting to reconnect to trading services...",
  });
  
  try {
    setApiStatus('checking');
    
    const hasApiKeys = await checkApiKeysAvailability();
    setApiKeysAvailable(hasApiKeys);
    
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
