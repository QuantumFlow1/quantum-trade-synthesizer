
import { useState, useCallback } from 'react';
import { StockbotMessage } from './types';
import { callStockbotAPI, createAssistantMessage, createErrorMessage } from './apiService';

export const useStockbotApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const callApi = useCallback(async (message: string, apiKey: string): Promise<StockbotMessage> => {
    setIsLoading(true);
    
    try {
      console.log('Calling Stockbot API from hook with message:', message);
      
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('API request timed out after 20 seconds')), 20000);
      });
      
      // Race the API call against the timeout
      const response = await Promise.race([
        callStockbotAPI(message, apiKey),
        timeoutPromise
      ]);
      
      if (response.success && response.response) {
        return createAssistantMessage(response.response);
      } else {
        return createErrorMessage(response.error || 'No response from API');
      }
    } catch (error) {
      console.error('Error in Stockbot API call:', error);
      return createErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    callApi,
    isLoading
  };
};
