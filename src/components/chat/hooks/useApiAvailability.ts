
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook to check API availability
 */
export const useApiAvailability = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if Grok3 API is available
  const checkGrokAvailability = useCallback(async () => {
    console.log('Checking Grok3 API availability...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        method: 'GET'
      });
      
      if (error) throw error;
      
      setApiAvailable(data?.status === 'available');
      console.log('Grok3 API status:', data?.status);
    } catch (error) {
      console.error('Error checking Grok API:', error);
      setApiAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Check if OpenAI API is available
  const checkOpenAIAvailability = useCallback(async () => {
    console.log('Checking OpenAI API availability...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-response', {
        method: 'GET'
      });
      
      if (error) throw error;
      
      setApiAvailable(data?.status === 'available');
      console.log('OpenAI API status:', data?.status);
      return data?.status === 'available';
    } catch (error) {
      console.error('Error checking OpenAI API:', error);
      setApiAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Retry API connection
  const retryApiConnection = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try both APIs
      const grokAvailable = await checkGrokAvailability();
      if (!grokAvailable) {
        await checkOpenAIAvailability();
      }
    } catch (error) {
      console.error('Error retrying API connection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [checkGrokAvailability, checkOpenAIAvailability]);

  return {
    apiAvailable,
    isLoading,
    checkGrokAvailability,
    checkOpenAIAvailability,
    retryApiConnection
  };
};
