
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./stockbot/types";
import { generateStockbotResponse, generateErrorResponse } from "./stockbot/responseSimulator";

export type { ChatMessage } from "./stockbot/types";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Enhanced API key check with more thorough detection
  useEffect(() => {
    const checkApiKey = () => {
      // Get the API key from localStorage
      const key = localStorage.getItem('groqApiKey');
      
      // Check if it exists and is valid (non-empty after trimming)
      const keyExists = !!key && key.trim().length > 0;
      
      console.log('useStockbotChat - API key check:', {
        exists: keyExists,
        length: key ? key.trim().length : 0,
        key: key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : 'none',
        simulationMode: isSimulationMode
      });
      
      // Update state based on key presence
      setHasApiKey(keyExists);
      
      // If we have a key but we're still in simulation mode, turn it off
      if (keyExists && isSimulationMode) {
        console.log('API key exists but still in simulation mode - switching to AI mode');
        setIsSimulationMode(false);
      }
    };
    
    // Initial check
    checkApiKey();
    
    // Set up multiple event listeners to catch any possible key changes
    window.addEventListener('apikey-updated', checkApiKey);
    window.addEventListener('localStorage-changed', checkApiKey);
    window.addEventListener('storage', checkApiKey);
    
    // Check frequently for API key changes during initialization
    const initialCheckInterval = setInterval(checkApiKey, 1000);
    setTimeout(() => clearInterval(initialCheckInterval), 5000);
    
    return () => {
      window.removeEventListener('apikey-updated', checkApiKey);
      window.removeEventListener('localStorage-changed', checkApiKey);
      window.removeEventListener('storage', checkApiKey);
    };
  }, [isSimulationMode]);
  
  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        role: 'assistant',
        text: 'Welcome to Stockbot! I can help you with market analysis and trading insights. How can I assist you today?',
        content: 'Welcome to Stockbot! I can help you with market analysis and trading insights. How can I assist you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);
  
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);
  
  const showApiKeyDialog = useCallback(() => {
    setIsKeyDialogOpen(true);
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
      // If the user is asking about API key, provide specific information
      if (inputMessage.toLowerCase().includes('api key') || 
          inputMessage.toLowerCase().includes('not working')) {
        const groqApiKey = localStorage.getItem('groqApiKey');
        console.log('User asking about API key - current status:', {
          exists: !!groqApiKey,
          length: groqApiKey ? groqApiKey.length : 0,
          key: groqApiKey ? `${groqApiKey.substring(0, 4)}...${groqApiKey.substring(groqApiKey.length - 4)}` : 'none',
          simulationMode: isSimulationMode
        });
      }
      
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
  }, [inputMessage, marketData, isSimulationMode]);
  
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen
  };
};
