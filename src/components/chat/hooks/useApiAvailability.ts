
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useApiAvailability(isAdminContext = false) {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // Helper function to check browser connection status
  const isOnline = () => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' 
      ? navigator.onLine 
      : true;
  };

  // Check if the Grok3 API is available
  const checkGrokAvailability = useCallback(async (forceCheck = false): Promise<boolean> => {
    if (isAdminContext && !forceCheck) {
      console.log('Skipping Grok3 API check in admin context');
      return false;
    }
    
    // If we're offline, don't attempt to check
    if (!isOnline()) {
      console.log('Browser is offline, skipping API check');
      setApiAvailable(false);
      setErrorMessage('Your device appears to be offline. Please check your internet connection.');
      return false;
    }
    
    // If we've checked recently (within 30 seconds), use cached result unless forced
    if (lastCheckTime && !forceCheck) {
      const timeSinceLastCheck = new Date().getTime() - lastCheckTime.getTime();
      if (timeSinceLastCheck < 30000) { // 30 seconds cache
        console.log(`Using cached API availability check result from ${timeSinceLastCheck}ms ago`);
        return apiAvailable || false;
      }
    }
    
    console.log('Checking Grok3 API availability...');
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Use the Supabase Edge Function to check Grok3 availability
      const { data, error } = await supabase.functions.invoke('grok3-ping', {
        body: { 
          isAvailabilityCheck: true,
          timestamp: new Date().toISOString(), // Add timestamp to prevent caching
          retry: retryCount // Add retry count for debugging
        }
      });
      
      console.log('Grok3 availability check result:', { data, error, retryCount });
      setLastCheckTime(new Date());
      
      if (error) {
        console.error('Grok3 API check error:', error);
        setErrorMessage(`Connection error: ${error.message}`);
        
        // Don't show toasts for subsequent retries to avoid spamming the user
        if (retryCount === 0) {
          toast({
            title: "API Connection Issue",
            description: "Could not connect to Grok3 API. Please try again later.",
            variant: "destructive"
          });
        }
        
        setApiAvailable(false);
        return false;
      }
      
      // Check if the API key is invalid from the response
      if (data?.status === "unavailable" && data?.message?.includes("Invalid API Key")) {
        setErrorMessage("Invalid API Key. Please check your API key in the settings.");
        
        if (retryCount === 0) {
          toast({
            title: "Invalid API Key",
            description: "Your Grok3 API key is invalid. Please update it in the settings.",
            variant: "destructive"
          });
        }
        
        setApiAvailable(false);
        return false;
      }
      
      const isAvailable = data?.status === "available";
      setApiAvailable(isAvailable);
      
      if (!isAvailable && retryCount === 0) {
        setErrorMessage(data?.message || "Grok3 API service is currently unavailable.");
        toast({
          title: "Grok3 API Unavailable",
          description: data?.message || "Grok3 API service is currently unavailable.",
          variant: "destructive"
        });
      }
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking Grok3 API:', error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Check failed: ${errorMsg}`);
      
      if (retryCount === 0) {
        toast({
          title: "API Check Failed",
          description: "Failed to verify Grok3 API availability.",
          variant: "destructive"
        });
      }
      
      setApiAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminContext, retryCount, lastCheckTime, apiAvailable]);

  // Try to reconnect to the API with exponential backoff
  const retryApiConnection = useCallback(async (): Promise<void> => {
    if (isAdminContext) {
      console.log('Retry API connection blocked in admin context');
      return;
    }
    
    if (!isOnline()) {
      console.log('Browser is offline, skipping retry');
      setErrorMessage('Your device appears to be offline. Please check your internet connection.');
      return;
    }
    
    console.log('Retrying API connection...');
    setRetryCount(prevCount => prevCount + 1);
    
    // Implement exponential backoff for retries
    const delay = Math.min(Math.pow(2, retryCount) * 1000, 10000); // Max 10s delay
    console.log(`Retry attempt ${retryCount + 1} with ${delay}ms delay`);
    
    toast({
      title: "Retrying Connection",
      description: `Attempt ${retryCount + 1} to reconnect to API services...`,
      duration: 3000,
    });
    
    // Wait for the backoff delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Try the connection again
    await checkGrokAvailability(true);
  }, [checkGrokAvailability, isAdminContext, retryCount, isOnline]);

  // Set up event listener for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser came online, rechecking API availability');
      checkGrokAvailability(true);
    };
    
    const handleOffline = () => {
      console.log('Browser went offline');
      setApiAvailable(false);
      setErrorMessage('Your device is offline. Please check your internet connection.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkGrokAvailability]);

  // Check availability when the component mounts
  useEffect(() => {
    if (!isAdminContext && apiAvailable === null) {
      checkGrokAvailability();
    }
  }, [apiAvailable, checkGrokAvailability, isAdminContext]);

  return { apiAvailable, isLoading, errorMessage, checkGrokAvailability, retryApiConnection };
}
