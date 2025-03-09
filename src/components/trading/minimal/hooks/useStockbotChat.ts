
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./stockbot/types";
import { generateStockbotResponse, generateErrorResponse } from "./stockbot/responseSimulator";
import { forceApiKeyReload } from "@/components/chat/api-keys/apiKeyUtils";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Reference to track initialization
  const isInitialized = useRef(false);
  const apiCheckCount = useRef(0);
  
  // Enhanced API key check with more thorough detection
  useEffect(() => {
    const checkApiKey = () => {
      // Get the API key from localStorage
      const key = localStorage.getItem('groqApiKey');
      
      // Check if it exists and is valid (non-empty after trimming)
      const keyExists = !!key && key.trim().length > 0;
      
      console.log('useStockbotChat - API key check #' + (apiCheckCount.current++), {
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
      
      // If we don't have a key but we're not in simulation mode, turn it on
      if (!keyExists && !isSimulationMode) {
        console.log('No API key found but not in simulation mode - switching to simulation mode');
        setIsSimulationMode(true);
      }
    };
    
    // Initial check
    checkApiKey();
    isInitialized.current = true;
    
    // Set up multiple event listeners to catch any possible key changes
    window.addEventListener('apikey-updated', checkApiKey);
    window.addEventListener('localStorage-changed', checkApiKey);
    window.addEventListener('storage', checkApiKey);
    
    // Check frequently for API key changes during initialization
    const initialCheckInterval = setInterval(checkApiKey, 1000);
    setTimeout(() => clearInterval(initialCheckInterval), 7000);
    
    // Also set up a broadcast channel listener if available
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('api-key-updates');
        broadcastChannel.onmessage = () => {
          console.log('Received broadcast message - checking API keys');
          checkApiKey();
        };
      }
    } catch (e) {
      console.error("Failed to setup broadcast channel:", e);
    }
    
    return () => {
      window.removeEventListener('apikey-updated', checkApiKey);
      window.removeEventListener('localStorage-changed', checkApiKey);
      window.removeEventListener('storage', checkApiKey);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
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
  
  // Force reload API keys
  const reloadApiKeys = useCallback(() => {
    console.log('Forced reload of API keys requested');
    forceApiKeyReload();
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
        
        // Try to force a reload of API keys
        forceApiKeyReload();
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
    setIsKeyDialogOpen,
    reloadApiKeys
  };
};
