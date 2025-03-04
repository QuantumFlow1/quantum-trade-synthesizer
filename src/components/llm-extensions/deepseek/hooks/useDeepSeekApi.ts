
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useDeepSeekApi() {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'available' | 'unavailable' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const checkDeepSeekApiStatus = useCallback(async () => {
    setIsApiLoading(true);
    setEdgeFunctionStatus('checking');
    
    try {
      const deepseekApiKey = localStorage.getItem('deepseekApiKey');
      
      // If no API key is set, mark as unavailable
      if (!deepseekApiKey) {
        console.log('No DeepSeek API key found in localStorage');
        setEdgeFunctionStatus('unavailable');
        setIsApiLoading(false);
        setLastChecked(new Date());
        return false;
      }
      
      // Check DeepSeek API connection via ping function
      const { data, error } = await supabase.functions.invoke('deepseek-ping', {
        body: { apiKey: deepseekApiKey }
      });
      
      if (error) {
        console.error('Error checking DeepSeek API status:', error);
        toast({
          title: "Connection Error",
          description: `Could not verify DeepSeek connection: ${error.message}`,
          variant: "destructive"
        });
        setEdgeFunctionStatus('unavailable');
        setIsApiLoading(false);
        setLastChecked(new Date());
        return false;
      }
      
      const isAvailable = data?.status === 'available';
      setEdgeFunctionStatus(isAvailable ? 'available' : 'unavailable');
      console.log(`DeepSeek API status: ${isAvailable ? 'available' : 'unavailable'}`);
      
      // Show toast with connection status
      if (isAvailable) {
        toast({
          title: "DeepSeek Connected",
          description: "Successfully connected to DeepSeek API.",
          duration: 3000,
        });
      } else {
        toast({
          title: "DeepSeek Unavailable",
          description: data?.message || "Could not connect to DeepSeek API.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      setLastChecked(new Date());
      setIsApiLoading(false);
      return isAvailable;
    } catch (error) {
      console.error('Exception checking DeepSeek API status:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      setEdgeFunctionStatus('unavailable');
      setIsApiLoading(false);
      setLastChecked(new Date());
      return false;
    }
  }, []);
  
  const sendMessageToDeepSeek = useCallback(async (messages: Array<{role: string, content: string}>, apiKey: string) => {
    setIsApiLoading(true);
    
    try {
      // First ping the API to ensure it's available
      const pingResponse = await supabase.functions.invoke('deepseek-ping', {
        body: { apiKey: apiKey }
      });
      
      if (pingResponse.error || pingResponse.data?.status !== 'available') {
        throw new Error(pingResponse.data?.message || 'DeepSeek API is currently unavailable');
      }
      
      // Call the DeepSeek Edge Function
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: { 
          context: messages.slice(0, -1), // Previous messages
          message: messages[messages.length - 1].content, // Current message
          apiKey: apiKey
        }
      });
      
      if (error) {
        console.error('Error calling DeepSeek API:', error);
        throw new Error(error.message || 'Failed to get response from DeepSeek');
      }
      
      if (!data || !data.response) {
        if (data?.error) {
          throw new Error(`DeepSeek API error: ${data.error}`);
        }
        throw new Error('Invalid response from DeepSeek API');
      }
      
      return data.response;
    } catch (error) {
      console.error('Exception sending message to DeepSeek:', error);
      throw error;
    } finally {
      setIsApiLoading(false);
    }
  }, []);
  
  return {
    isApiLoading,
    edgeFunctionStatus,
    lastChecked,
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek
  };
}
