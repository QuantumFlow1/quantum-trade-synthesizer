
import { useState } from 'react';
import { EdgeFunctionStatus } from '../../types/chatTypes';

export function useDeepSeekApi() {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<EdgeFunctionStatus>('checking');

  /**
   * Checks if the DeepSeek API edge function is available
   */
  const checkDeepSeekApiStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/deepseek-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: 'test' }],
          apiKey: 'test'
        }),
      });
      
      if (response.ok) {
        setEdgeFunctionStatus('available');
        return true;
      } else {
        console.error('DeepSeek API is not available:', await response.text());
        setEdgeFunctionStatus('unavailable');
        return false;
      }
    } catch (error) {
      console.error('Error checking DeepSeek API status:', error);
      setEdgeFunctionStatus('unavailable');
      return false;
    }
  };

  /**
   * Sends a message to the DeepSeek API
   */
  const sendMessageToDeepSeek = async (messages: any[], apiKey: string): Promise<string> => {
    setIsApiLoading(true);
    
    try {
      const response = await fetch('/api/deepseek-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          apiKey,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error from DeepSeek API:', errorText);
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Error sending message to DeepSeek:', error);
      throw error;
    } finally {
      setIsApiLoading(false);
    }
  };

  return {
    isApiLoading,
    edgeFunctionStatus,
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek,
  };
}
