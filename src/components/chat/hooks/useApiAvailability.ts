
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useApiAvailability(isAdminContext = false) {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the Grok3 API is available
  const checkGrokAvailability = useCallback(async (): Promise<boolean> => {
    if (isAdminContext) {
      console.log('Skipping Grok3 API check in admin context');
      return false;
    }
    
    console.log('Checking Grok3 API availability...');
    setIsLoading(true);
    
    try {
      // Use the Supabase Edge Function to check Grok3 availability
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          message: "test",
          context: [],
          settings: {
            deepSearch: false,
            think: false
          },
          isAvailabilityCheck: true
        }
      });
      
      console.log('Grok3 availability check result:', { data, error });
      
      if (error) {
        console.error('Grok3 API check error:', error);
        setApiAvailable(false);
        return false;
      }
      
      setApiAvailable(true);
      return true;
    } catch (error) {
      console.error('Error checking Grok3 API:', error);
      setApiAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminContext]);

  // Try to reconnect to the API
  const retryApiConnection = useCallback(async (): Promise<void> => {
    if (isAdminContext) {
      console.log('Retry API connection blocked in admin context');
      return;
    }
    
    console.log('Retrying API connection...');
    await checkGrokAvailability();
  }, [checkGrokAvailability, isAdminContext]);

  // Check availability when the component mounts
  useEffect(() => {
    if (!isAdminContext && apiAvailable === null) {
      checkGrokAvailability();
    }
  }, [apiAvailable, checkGrokAvailability, isAdminContext]);

  return { apiAvailable, isLoading, checkGrokAvailability, retryApiConnection };
}
