
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useApiAvailability = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkGrokAvailability = async () => {
    setIsLoading(true);
    try {
      console.log('Checking Grok3 API availability...');
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      });
      
      if (error) {
        console.error('Error checking Grok API:', error);
        setApiAvailable(false);
        toast({
          title: "API Status",
          description: "De Grok API is momenteel niet beschikbaar. We gebruiken een alternatieve AI-service.",
          variant: "destructive",
          duration: 7000
        });
        return false;
      }
      
      const isAvailable = data?.available || false;
      setApiAvailable(isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "API Status",
          description: "De Grok API is momenteel niet beschikbaar. We gebruiken een alternatieve AI-service.",
          variant: "destructive",
          duration: 7000
        });
      }
      
      console.log('Grok3 API available:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Failed to check API availability:', error);
      setApiAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const retryApiConnection = async () => {
    const isAvailable = await checkGrokAvailability();
    if (isAvailable) {
      toast({
        title: "Verbinding hersteld",
        description: "De Grok API is nu beschikbaar.",
        duration: 3000,
      });
    }
    return isAvailable;
  };

  return {
    apiAvailable,
    isLoading,
    checkGrokAvailability,
    retryApiConnection
  };
};
