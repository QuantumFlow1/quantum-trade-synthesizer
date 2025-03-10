
import { useState, useCallback } from 'react';
import { StockbotMessage } from './types';
import { useStockbotApi } from './useStockbotApi';
import { useStockbotSettings } from './useStockbotSettings';
import { loadMessages, saveMessages } from './storage';

/**
 * Hook to manage Stockbot state
 */
export const useStockbotState = () => {
  // Load saved messages from localStorage
  const [messages, setMessages] = useState<StockbotMessage[]>(loadMessages() as StockbotMessage[]);
  const [inputMessage, setInputMessage] = useState('');
  const { isLoading, sendMessage } = useStockbotApi();
  const { isSimulationMode } = useStockbotSettings();

  /**
   * Send a message and get a response
   */
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    // Create a new user message
    const userMessage: StockbotMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    // Add the user message to the list
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save to localStorage
    saveMessages(updatedMessages);
    
    // Clear the input
    setInputMessage('');

    try {
      // Get response from API or simulation
      const response = await sendMessage(inputMessage, isSimulationMode);
      
      // Create a response message
      const responseMessage: StockbotMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      // Add the response to the list
      const finalMessages = [...updatedMessages, responseMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: StockbotMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: Date.now()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }
  }, [inputMessage, messages, sendMessage, isSimulationMode]);

  /**
   * Clear the message history
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  };
};

// For backward compatibility
export const useStockbotChatState = useStockbotState;
