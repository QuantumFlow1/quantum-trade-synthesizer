
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotApiHook } from './types';
import { generateStockbotResponse, generateErrorResponse } from './responseSimulator';
import { saveMessages, loadMessages } from './storage';

export const useStockbotApi = (
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  marketData: any[] = []
): StockbotApiHook => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Load API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('groqApiKey');
    setApiKey(storedKey);
    
    // Load previous messages
    const savedMessages = loadMessages();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, [setMessages]);

  // Send a message to the API
  const handleSendMessage = useCallback(async (inputMessage: string, isSimulationMode: boolean = true) => {
    if (!inputMessage.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      role: 'user',
      text: inputMessage,
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to the chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      let response: ChatMessage;

      if (isSimulationMode) {
        // Use simulation mode (no API call)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        response = generateStockbotResponse(inputMessage, marketData);
      } else {
        // Check if API key exists
        if (!apiKey) {
          response = generateErrorResponse("API key is missing. Please add your API key in the settings.");
        } else {
          // Placeholder for real API call
          // In a real implementation, you would call the API here
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
          response = generateStockbotResponse(inputMessage, marketData); // Fallback to simulation
        }
      }

      // Add assistant message to the chat
      const finalMessages = [...updatedMessages, response];
      setMessages(finalMessages);
      
      // Save messages to local storage
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        role: 'assistant',
        text: 'Sorry, I encountered an error processing your request.',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, setMessages, setIsLoading, apiKey, marketData]);

  return {
    handleSendMessage
  };
};
