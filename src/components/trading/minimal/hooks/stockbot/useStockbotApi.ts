
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./types";
import { callStockbotAPI, createAssistantMessage, createErrorMessage } from "./apiService";

/**
 * Core hook for Stockbot API integration
 */
export const useStockbotApi = (marketData: any[] = []): Partial<StockbotChatHook> => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      role: 'user',
      text: inputMessage,
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call API
      const response = await callStockbotAPI(inputMessage, marketData);
      
      if (response.error) {
        // Handle error response
        const errorMessage = createErrorMessage(response.error);
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Handle success response
        const assistantMessage = createAssistantMessage(response.response);
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error handling message:", error);
      
      // Add error message to chat
      const errorMessage = createErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred while processing your request."
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  }, [inputMessage, marketData]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage
  };
};
