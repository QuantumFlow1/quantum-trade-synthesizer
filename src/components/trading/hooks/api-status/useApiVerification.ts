
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useWebSocketConnection } from "./useWebSocketConnection";

export function useApiVerification() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { setupWebSocketConnection } = useWebSocketConnection();

  const verifyApiStatus = useCallback(async (
    setApiStatus: (status: 'checking' | 'available' | 'unavailable') => void,
    wsConnection: WebSocket | null
  ) => {
    try {
      setIsVerifying(true);
      console.log("Verifying API status...");
      
      // Set initial checking state
      setApiStatus('checking');
      
      // First check - try to reach the API endpoint
      const { data, error } = await supabase.functions.invoke('market-data-collector', {
        body: { action: 'ping' }
      });
      
      if (error) {
        console.error("API verification failed:", error);
        setFailedAttempts(prev => prev + 1);
        setApiStatus('unavailable');
        setLastChecked(new Date());
        setIsVerifying(false);
        return () => {};
      }
      
      // Try to set up real-time connection
      const cleanup = setupWebSocketConnection(setApiStatus, wsConnection);
      
      console.log("API is available:", data);
      setApiStatus('available');
      setLastChecked(new Date());
      setFailedAttempts(0);
      setIsVerifying(false);
      
      return cleanup;
    } catch (error) {
      console.error("Error during API verification:", error);
      setFailedAttempts(prev => prev + 1);
      setApiStatus('unavailable');
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
    verifyApiStatus
  };
}

// Add missing import
import { useState } from "react";
