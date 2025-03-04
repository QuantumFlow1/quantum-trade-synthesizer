
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
      const { data, error } = await supabase.functions.invoke('grok3-ping', {
        body: { isAvailabilityCheck: true }
      });
      
      console.log('Grok3 availability check result:', { data, error });
      
      if (error) {
        console.error('Grok3 API check error:', error);
        toast({
          title: "API Connection Issue",
          description: "Could not connect to Grok3 API. Please try again later.",
          variant: "destructive"
        });
        setApiAvailable(false);
        return false;
      }
      
      const isAvailable = data?.status === "available";
      setApiAvailable(isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "Grok3 API Unavailable",
          description: data?.message || "Grok3 API service is currently unavailable.",
          variant: "destructive"
        });
      }
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking Grok3 API:', error);
      toast({
        title: "API Check Failed",
        description: "Failed to verify Grok3 API availability.",
        variant: "destructive"
      });
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
