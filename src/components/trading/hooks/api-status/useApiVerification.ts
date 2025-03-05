
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { checkAPIAvailability, pingApiService } from "./apiAvailabilityUtils";
import { useWebSocketConnection } from "./useWebSocketConnection";

export function useApiVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { setupWebSocketConnection } = useWebSocketConnection();
  
  const verifyApiStatus = useCallback(async (
    setApiStatus: (status: 'checking' | 'available' | 'unavailable') => void,
    wsConnection: WebSocket | null
  ) => {
    setIsVerifying(true);
    try {
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        console.log("No API keys available");
        setApiStatus('unavailable');
        setFailedAttempts(prev => prev + 1);
        toast({
          title: "API service unavailable",
          description: "No API keys available. Please configure API keys in settings.",
          variant: "destructive"
        });
        setLastChecked(new Date());
        setIsVerifying(false);
        return () => {};
      }
      
      const pingResult = await pingApiService();
      
      if (pingResult.isAvailable) {
        console.log("API is available");
        setApiStatus('available');
        setFailedAttempts(0);
        
        // Setup WebSocket connection for real-time updates
        const cleanup = setupWebSocketConnection(setApiStatus, wsConnection);
        
        toast({
          title: "Connected to AI services",
          description: "Successfully connected to AI trading services.",
          duration: 3000
        });
        
        setLastChecked(new Date());
        setIsVerifying(false);
        return cleanup;
      } else {
        console.error("API is unavailable:", pingResult.message);
        setApiStatus('unavailable');
        setFailedAttempts(prev => prev + 1);
        toast({
          title: "API service unavailable",
          description: pingResult.message || "AI services are currently unavailable",
          variant: "destructive"
        });
        
        setLastChecked(new Date());
        setIsVerifying(false);
        return () => {};
      }
    } catch (error) {
      console.error("Exception verifying API status:", error);
      setApiStatus('unavailable');
      setFailedAttempts(prev => prev + 1);
      toast({
        title: "Connection error",
        description: "An unexpected error occurred while checking API status",
        variant: "destructive"
      });
      setLastChecked(new Date());
      setIsVerifying(false);
      return () => {};
    }
  }, [setupWebSocketConnection]);

  return {
    isVerifying,
    failedAttempts,
    lastChecked,
    setFailedAttempts,
    setLastChecked,
    verifyApiStatus
  };
}
