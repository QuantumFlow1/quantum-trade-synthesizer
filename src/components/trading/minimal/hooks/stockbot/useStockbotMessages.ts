
import { useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from "../stockbot/types";
import { generateStockbotResponse, generateErrorResponse } from "../stockbot/responseSimulator";

// Initial welcome message
const WELCOME_MESSAGE: ChatMessage = {
  id: uuidv4(),
  sender: 'assistant',
  role: 'assistant',
  text: 'Welcome to Stockbot! I can help you with market analysis and trading insights. How can I assist you today?',
  content: 'Welcome to Stockbot! I can help you with market analysis and trading insights. How can I assist you today?',
  timestamp: new Date()
};

/**
 * Hook for managing stockbot messages and interactions
 */
export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkGroqApiKey: () => boolean
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset chat to initial state
  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);
  
  // Handle sending a message
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
      // Double-check API key status before responding
      const hasKey = checkGroqApiKey();
      
      // Log the current API key status for debugging
      console.log('Sending message with current API status:', {
        hasGroqKey,
        hasKey,
        isSimulationMode
      });
      
      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on message content
      const assistantMessage = generateStockbotResponse(inputMessage, marketData);
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error handling message:", error);
      
      // Add error message to chat
      const errorMessage = generateErrorResponse(
        error instanceof Error ? error.message : "An unknown error occurred while processing your message."
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  }, [inputMessage, marketData, checkGroqApiKey, hasGroqKey, isSimulationMode]);
  
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  };
};
