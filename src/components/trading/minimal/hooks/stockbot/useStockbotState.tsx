
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotStatus } from './types';
import { generateStockbotResponse } from './responseSimulator';
import { sendMessageToStockbot } from './apiService';
import { loadStockbotChatHistory, saveStockbotChatHistory } from './storage';

export interface StockbotStateProps {
  initialMessages?: ChatMessage[];
  marketData?: any;
}

export const useStockbotState = ({ 
  initialMessages = [], 
  marketData 
}: StockbotStateProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = loadStockbotChatHistory();
    return savedMessages.length > 0 ? savedMessages : initialMessages;
  });
  
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<StockbotStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  
  // Save chat history whenever messages change
  useEffect(() => {
    if (!isFirstLoad.current) {
      saveStockbotChatHistory(messages);
    } else {
      isFirstLoad.current = false;
    }
  }, [messages]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const addMessage = (message: ChatMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };
  
  const clearMessages = () => {
    setMessages([]);
    saveStockbotChatHistory([]);
  };
  
  const sendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    addMessage(userMessage);
    setInputValue('');
    setStatus('thinking');
    setError(null);
    
    try {
      let response;
      
      if (isApiAvailable) {
        // Use real API if available
        response = await sendMessageToStockbot(text, marketData);
        
        if (typeof response === 'object' && response !== null) {
          // Check if the response has a timestamp property to determine if it's a valid message object
          if ('timestamp' in response) {
            addMessage(response);
          } else if ('source' in response) {
            // Handle case where response is not a message but an error object
            setError(`Error from API: ${response.message || 'Unknown error'}`);
          } else {
            setError('Invalid response format from API');
          }
        } else {
          setError('Invalid response from API');
        }
      } else {
        // Use simulated response
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = generateStockbotResponse(text, marketData);
        addMessage(response);
      }
      
      setStatus('idle');
    } catch (err) {
      console.error('Error sending message to Stockbot:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };
  
  const checkApiAvailability = useCallback(async () => {
    setStatus('checking');
    try {
      // Implement API availability check
      const isAvailable = false; // Default to false for now
      setIsApiAvailable(!!isAvailable);
      setStatus('idle');
    } catch (error) {
      console.error('Error checking API availability:', error);
      setIsApiAvailable(false);
      setStatus('error');
    }
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const addInitialGreeting = useCallback(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: uuidv4(),
        text: "Hello! I'm Stockbot, your AI trading assistant. I can help with market analysis, trading strategies, and answering questions about cryptocurrencies and stocks. What would you like to know today?",
        sender: 'assistant',
        timestamp: new Date(),
      };
      addMessage(greeting);
    }
  }, [messages.length]);
  
  // Add initial greeting on first load if there are no messages
  useEffect(() => {
    addInitialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Check API availability when component mounts
  useEffect(() => {
    checkApiAvailability();
  }, [checkApiAvailability]);
  
  return {
    messages,
    inputValue,
    status,
    error,
    isApiAvailable,
    messagesEndRef,
    setInputValue,
    handleInputChange,
    sendMessage,
    clearMessages,
    handleKeyDown,
    checkApiAvailability,
  };
};
