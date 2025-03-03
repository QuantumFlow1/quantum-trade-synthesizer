
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { EdgeFunctionStatus } from '../../types/chatTypes';

export function useDeepSeekApi() {
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<EdgeFunctionStatus>('checking');

  /**
   * Checks if the DeepSeek Edge Function is available
   */
  const checkEdgeFunctionStatus = async () => {
    setEdgeFunctionStatus('checking');
    
    try {
      // Try to ping the deepseek service
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: { ping: true }
      });
      
      if (error) {
        console.error('DeepSeek edge function error:', error);
        setEdgeFunctionStatus('unavailable');
        return;
      }
      
      if (data?.available) {
        setEdgeFunctionStatus('available');
      } else {
        setEdgeFunctionStatus('unavailable');
      }
    } catch (error) {
      console.error('Error checking DeepSeek availability:', error);
      setEdgeFunctionStatus('unavailable');
    }
  };

  /**
   * Sends a message to the DeepSeek API
   */
  const sendMessageToApi = async (
    inputMessage: string,
    history: Array<{ role: string; content: string }>,
    apiKey: string
  ) => {
    try {
      // Call the DeepSeek edge function
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: {
          messages: [...history, { role: 'user', content: inputMessage }],
          apiKey
        }
      });
      
      if (error) {
        throw error;
      }
      
      return { response: data.response || "I couldn't generate a response at this time." };
    } catch (error) {
      console.error('DeepSeek API error:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    edgeFunctionStatus,
    checkEdgeFunctionStatus,
    sendMessageToApi
  };
}
