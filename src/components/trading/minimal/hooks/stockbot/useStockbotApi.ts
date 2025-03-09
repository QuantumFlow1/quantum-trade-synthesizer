
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { callStockbotApi, createResponseMessage, createErrorMessage } from './apiService';
import { ChatMessage, StockbotChatHook } from './types';

export const useStockbotApi = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = useCallback(async (
    message: string,
    apiKey: string | null
  ): Promise<ChatMessage> => {
    setIsLoading(true);
    
    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'user',
        role: 'user',
        text: message,
        content: message,
        timestamp: new Date()
      };
      
      // Add user message to chat
      setMessages(prev => [...prev, userMessage]);
      
      // Call API if key exists
      if (apiKey) {
        const response = await callStockbotApi(message, apiKey);
        
        // Create response message
        const responseMessage = createResponseMessage(response.response);
        
        // Add response to chat
        setMessages(prev => [...prev, responseMessage]);
        return responseMessage;
      } else {
        throw new Error('No API key available');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create error message
      const errorMessage = createErrorMessage(
        error instanceof Error ? error.message : 'Failed to get response'
      );
      
      // Add error message to chat
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    messages,
    setMessages,
    isLoading,
    sendMessage
  };
};
