
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook to check API availability
 */
export const useApiAvailability = () => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceStatuses, setServiceStatuses] = useState<{
    grok3: boolean | null;
    openai: boolean | null;
    deepseek: boolean | null;
  }>({
    grok3: null,
    openai: null,
    deepseek: null
  });
  
  // Check if we're in the admin context
  const isAdminContext = typeof window !== 'undefined' && window.location.pathname.includes('/admin');

  // Check if Grok3 API is available
  const checkGrokAvailability = useCallback(async () => {
    if (isAdminContext) {
      console.log('Skipping Grok3 API availability check in admin context');
      return false;
    }
    
    console.log('Checking Grok3 API availability...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        method: 'GET'
      });
      
      if (error) throw error;
      
      const isAvailable = data?.status === 'available';
      setApiAvailable(isAvailable);
      setServiceStatuses(prev => ({ ...prev, grok3: isAvailable }));
      console.log('Grok3 API status:', data?.status);
      return isAvailable;
    } catch (error) {
      console.error('Error checking Grok API:', error);
      setApiAvailable(false);
      setServiceStatuses(prev => ({ ...prev, grok3: false }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminContext]);
  
  // Check if OpenAI API is available
  const checkOpenAIAvailability = useCallback(async () => {
    if (isAdminContext) {
      console.log('Skipping OpenAI API availability check in admin context');
      return false;
    }
    
    console.log('Checking OpenAI API availability...');
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-response', {
        method: 'GET'
      });
      
      if (error) throw error;
      
      const isAvailable = data?.status === 'available';
      setApiAvailable(isAvailable);
      setServiceStatuses(prev => ({ ...prev, openai: isAvailable }));
      console.log('OpenAI API status:', data?.status);
      return isAvailable;
    } catch (error) {
      console.error('Error checking OpenAI API:', error);
      setApiAvailable(false);
      setServiceStatuses(prev => ({ ...prev, openai: false }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminContext]);

  // Check if DeepSeek API is available
  const checkDeepSeekAvailability = useCallback(async () => {
    if (isAdminContext) {
      console.log('Skipping DeepSeek API availability check in admin context');
      return false;
    }
    
    console.log('Checking DeepSeek API availability...');
    setIsLoading(true);
    
    try {
      // We use a test payload just to check if the function exists
      const { error } = await supabase.functions.invoke('deepseek-response', {
        body: { 
          message: "system: ping test",
          context: [],
          model: "deepseek-chat",
          maxTokens: 10,
          temperature: 0.7,
          apiKey: "test-key" // Just for checking if the function exists
        }
      });
      
      // We expect an API key error, but not a function unavailable error
      const isAvailable = !error || error.message.includes('API key');
      setServiceStatuses(prev => ({ ...prev, deepseek: isAvailable }));
      console.log('DeepSeek API status:', isAvailable ? 'available' : 'unavailable');
      
      // Don't update overall availability just for DeepSeek
      // setApiAvailable(isAvailable);
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking DeepSeek API:', error);
      setServiceStatuses(prev => ({ ...prev, deepseek: false }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAdminContext]);

  // Retry API connection for all services
  const retryApiConnection = useCallback(async () => {
    if (isAdminContext) {
      console.log('Skipping API connection retry in admin context');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try all APIs
      const grokAvailable = await checkGrokAvailability();
      const openaiAvailable = await checkOpenAIAvailability();
      const deepseekAvailable = await checkDeepSeekAvailability();
      
      // Set overall availability if at least one service is available
      setApiAvailable(grokAvailable || openaiAvailable || deepseekAvailable);
    } catch (error) {
      console.error('Error retrying API connection:', error);
      setApiAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [checkGrokAvailability, checkOpenAIAvailability, checkDeepSeekAvailability, isAdminContext]);

  return {
    apiAvailable: isAdminContext ? false : apiAvailable,
    isLoading: isAdminContext ? false : isLoading,
    serviceStatuses: isAdminContext ? { grok3: false, openai: false, deepseek: false } : serviceStatuses,
    checkGrokAvailability,
    checkOpenAIAvailability,
    checkDeepSeekAvailability,
    retryApiConnection
  };
};
