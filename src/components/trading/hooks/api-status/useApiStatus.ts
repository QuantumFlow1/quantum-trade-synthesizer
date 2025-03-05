
import { useState, useEffect } from "react";
import { useApiVerification } from "./useApiVerification";

export function useApiStatus(initialStatus: 'checking' | 'available' | 'unavailable' = 'checking') {
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>(initialStatus);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  
  const {
    isVerifying,
    failedAttempts,
    lastChecked,
    setFailedAttempts,
    verifyApiStatus
  } = useApiVerification();

  // Handle async effect for API verification
  useEffect(() => {
    let cleanupFunction = () => {};
    
    const performCheck = async () => {
      if (apiStatus === 'checking') {
        try {
          const cleanup = await verifyApiStatus(setApiStatus, wsConnection);
          cleanupFunction = cleanup;
        } catch (error) {
          console.error("Error performing API check:", error);
          setApiStatus('unavailable');
        }
      }
    };
    
    performCheck();
    
    // Set up automatic retry for failed connections
    let retryTimer: NodeJS.Timeout | null = null;
    if (apiStatus === 'unavailable' && failedAttempts < 3) {
      const retryDelay = Math.min(5000 * (failedAttempts + 1), 30000); // Exponential backoff
      retryTimer = setTimeout(() => {
        console.log(`Automatic retry attempt ${failedAttempts + 1} after ${retryDelay/1000}s`);
        verifyApiStatus(setApiStatus, wsConnection);
      }, retryDelay);
    }
    
    // Return a cleanup function that calls the cleanup returned from verifyApiStatus
    // and also clears any retry timers
    return () => {
      cleanupFunction();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [apiStatus, verifyApiStatus, failedAttempts, wsConnection]);

  return {
    apiStatus,
    setApiStatus,
    isVerifying,
    verifyApiStatus: () => verifyApiStatus(setApiStatus, wsConnection),
    lastChecked,
    failedAttempts
  };
}
