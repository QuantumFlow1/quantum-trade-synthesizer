
import { useState, useCallback } from 'react';
import { StockbotMessage } from './types';
import { callStockbotAPI, createAssistantMessage, createErrorMessage } from './apiService';

export const useStockbotApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const callApi = useCallback(async (message: string, apiKey: string): Promise<StockbotMessage> => {
    setIsLoading(true);
    
    try {
      console.log('Calling Stockbot API from hook with message:', message);
      
      const response = await callStockbotAPI(message, apiKey);
      
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
