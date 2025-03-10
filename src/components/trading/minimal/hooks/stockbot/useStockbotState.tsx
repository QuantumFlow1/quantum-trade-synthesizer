
import { useState, useCallback } from 'react';
import { StockbotMessage, ChatMessage } from './types';
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
  const { isLoading, callApi } = useStockbotApi();
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
      sender: 'user',
      content: inputMessage,
      text: inputMessage,
      timestamp: new Date() // Using Date object instead of number
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
      // Get the API key from localStorage if not in simulation mode
      const apiKey = isSimulationMode ? '' : localStorage.getItem('groqApiKey') || '';
      const response = await callApi(inputMessage, apiKey);
      
      // Create a response message
      const responseMessage: StockbotMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        sender: 'assistant',
        content: response.content || 'Error: No content received',
        text: response.content || 'Error: No content received',
        timestamp: new Date() // Using Date object instead of number
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
        sender: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        text: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        timestamp: new Date() // Using Date object instead of number
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }
  }, [inputMessage, messages, callApi, isSimulationMode]);

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
