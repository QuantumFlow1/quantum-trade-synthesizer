
import { useState, useEffect, useCallback } from 'react';
import { EdgeFunctionStatus } from '../../types/chatTypes';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export function useDeepSeekApi() {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<EdgeFunctionStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Listen for API key changes from other components
  useEffect(() => {
    const handleApiKeyUpdate = () => {
      console.log('DeepSeek API key was updated, rechecking status');
      checkDeepSeekApiStatus();
    };

    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    
    // Initial check when component mounts
    if (edgeFunctionStatus === 'checking') {
      checkDeepSeekApiStatus();
    }
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
    };
  }, []);

  /**
   * Checks if the DeepSeek API edge function is available
   */
  const checkDeepSeekApiStatus = useCallback(async (): Promise<boolean> => {
    try {
      setEdgeFunctionStatus('checking');
      console.log('Checking DeepSeek API connection status...');
      
      // Get the API key from localStorage if available or fetch admin key
      let apiKey = localStorage.getItem('deepseekApiKey');
      
      if (!apiKey) {
        // Try to get admin key from Supabase
        try {
          const { data, error } = await supabase.functions.invoke('get-admin-key', {
            body: { provider: 'deepseek' }
          });
          
          if (!error && data?.key) {
            apiKey = data.key;
            console.log('Using admin DeepSeek API key');
          }
        } catch (keyError) {
          console.error('Error fetching admin DeepSeek API key:', keyError);
        }
      }
      
      if (!apiKey) {
        console.log('No DeepSeek API key found in localStorage or admin keys');
        setEdgeFunctionStatus('unavailable');
        return false;
      }
      
      console.log('Testing DeepSeek API connection with API key');
      
      const response = await fetch('/api/deepseek-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: 'connection test' }],
          apiKey
        }),
      });
      
      const responseText = await response.text();
      console.log('DeepSeek API connection test response:', response.status, responseText);
      
      if (response.ok) {
        console.log('DeepSeek API connection successful');
        setEdgeFunctionStatus('available');
        setLastChecked(new Date());
        
        // Notify parent component about successful connection
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'connected' }
        }));
        
        return true;
      } else {
        console.error('DeepSeek API is not available:', responseText);
        setEdgeFunctionStatus('unavailable');
        
        // Notify parent component about failed connection
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'error' }
        }));
        
        return false;
      }
    } catch (error) {
      console.error('Error checking DeepSeek API status:', error);
      setEdgeFunctionStatus('unavailable');
      
      // Notify parent component about error
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'deepseek', status: 'error' }
      }));
      
      return false;
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  /**
   * Sends a message to the DeepSeek API
   */
  const sendMessageToDeepSeek = async (messages: any[], apiKey: string): Promise<string> => {
    setIsApiLoading(true);
    
    try {
      console.log('Sending message to DeepSeek API with messages length:', messages.length);
      
      if (!apiKey) {
        throw new Error('DeepSeek API key is required');
      }
      
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

      try {
        const data = await response.json();
        console.log('Received successful response from DeepSeek API');
        return data.content || '';
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response format from DeepSeek API');
      }
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
    lastChecked,
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek,
  };
}
