
import { useState, useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./stockbot/types";
import { generateStockbotResponse, generateErrorResponse } from "./stockbot/responseSimulator";
import { hasApiKey, API_KEY_UPDATED_EVENT, LOCALSTORAGE_CHANGED_EVENT } from "@/utils/apiKeyManager";
import { showApiKeyDetectedToast, showApiKeyErrorToast } from "@/components/chat/api-keys/ApiKeyToastNotification";
import { toast } from "@/hooks/use-toast";

// Storage key for Stockbot settings
const STOCKBOT_SETTINGS_KEY = 'stockbot-settings';

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
 * Persist stockbot settings to localStorage
 */
const saveStockbotSettings = (settings: { isSimulationMode: boolean }) => {
  try {
    localStorage.setItem(STOCKBOT_SETTINGS_KEY, JSON.stringify(settings));
    console.log('Stockbot settings saved:', settings);
  } catch (e) {
    console.error('Failed to save stockbot settings:', e);
  }
};

/**
 * Load stockbot settings from localStorage
 */
const loadStockbotSettings = (): { isSimulationMode: boolean } => {
  try {
    const savedSettings = localStorage.getItem(STOCKBOT_SETTINGS_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (e) {
    console.error('Failed to load stockbot settings:', e);
  }
  
  // Default settings
  return { isSimulationMode: true };
};

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  // Load saved settings
  const savedSettings = loadStockbotSettings();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const [isSimulationMode, setIsSimulationMode] = useState(savedSettings.isSimulationMode);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Reference to track initialization and prevent infinite loops
  const isInitialized = useRef(false);
  const manuallySetMode = useRef(false);
  const apiKeyCheckTimerId = useRef<number | null>(null);
  const lastKeyCheckTime = useRef(0);
  
  // Persist simulation mode setting whenever it changes
  useEffect(() => {
    if (manuallySetMode.current) {
      saveStockbotSettings({ isSimulationMode });
      console.log("Simulation mode changed to:", isSimulationMode);
    }
  }, [isSimulationMode]);
  
  // Check if the Groq API key exists with improved caching
  const checkGroqApiKey = useCallback(() => {
    // Skip frequent checks (no more than once every 500ms)
    const now = Date.now();
    if (now - lastKeyCheckTime.current < 500) {
      return hasGroqKey;
    }
    
    lastKeyCheckTime.current = now;
    const keyExists = hasApiKey('groq');
    const groqKeyValue = localStorage.getItem('groqApiKey');
    
    console.log('useStockbotChat - API key check:', {
      exists: keyExists,
      keyLength: groqKeyValue ? groqKeyValue.length : 0,
      previousState: hasGroqKey,
      timestamp: new Date().toISOString()
    });
    
    if (keyExists !== hasGroqKey) {
      console.log('useStockbotChat - API key status change detected:', {
        exists: keyExists,
        previousState: hasGroqKey,
        keyLength: groqKeyValue ? groqKeyValue.length : 0
      });
      
      setHasGroqKey(keyExists);
      
      // Only auto-switch modes if we haven't been manually set
      if (!manuallySetMode.current) {
        if (keyExists && isSimulationMode) {
          console.log('API key exists but still in simulation mode - switching to AI mode');
          setIsSimulationMode(false);
          saveStockbotSettings({ isSimulationMode: false });
          showApiKeyDetectedToast('Groq');
        } else if (!keyExists && !isSimulationMode) {
          console.log('No API key found but not in simulation mode - switching to simulation mode');
          setIsSimulationMode(true);
          saveStockbotSettings({ isSimulationMode: true });
          toast({
            title: "Simulation Mode Activated",
            description: "No API key found, switching to simulation mode",
            variant: "warning"
          });
        }
      }
    }
    
    return keyExists;
  }, [hasGroqKey, isSimulationMode]);
  
  // Setup event listeners for API key changes with improved reliability
  useEffect(() => {
    // Run initial check immediately
    const initialKeyStatus = checkGroqApiKey();
    console.log('Initial API key status:', { exists: initialKeyStatus });
    
    isInitialized.current = true;
    
    // Set up event listeners
    const handleApiKeyUpdate = () => {
      console.log("Key event listener triggered");
      checkGroqApiKey();
    };
    
    // Listen to multiple events to ensure we catch all changes
    window.addEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
    window.addEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    window.addEventListener('focus', handleApiKeyUpdate); // Check when window regains focus
    
    // Check frequently for API key changes
    if (typeof window !== 'undefined') {
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
      }
      
      apiKeyCheckTimerId.current = window.setInterval(checkGroqApiKey, 2000);
    }
    
    // Try to use BroadcastChannel if available for cross-tab communication
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.onmessage = (event) => {
        console.log('Received broadcast channel message:', event.data);
        if (event.data.type === 'api-key-update') {
          checkGroqApiKey();
        }
      };
    } catch (err) {
      console.log('BroadcastChannel not supported:', err);
    }
    
    return () => {
      window.removeEventListener(API_KEY_UPDATED_EVENT, handleApiKeyUpdate);
      window.removeEventListener(LOCALSTORAGE_CHANGED_EVENT, handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      window.removeEventListener('focus', handleApiKeyUpdate);
      
      if (apiKeyCheckTimerId.current) {
        clearInterval(apiKeyCheckTimerId.current);
        apiKeyCheckTimerId.current = null;
      }
      
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [checkGroqApiKey]);
  
  // Add welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([WELCOME_MESSAGE]);
    }
  }, [messages.length]);
  
  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);
  
  const showApiKeyDialog = useCallback(() => {
    setIsKeyDialogOpen(true);
  }, []);
  
  // Force reload API keys
  const reloadApiKeys = useCallback(() => {
    console.log('Forced reload of API keys requested');
    // Clear any cached state that might be preventing updates
    localStorage.removeItem('_dummy_key_');
    
    // Force immediate check
    const keyExists = checkGroqApiKey();
    console.log('Force reloaded API key status:', { exists: keyExists });
    
    // Broadcast the change to all components
    window.dispatchEvent(new Event(API_KEY_UPDATED_EVENT));
    
    // Show toast notification
    if (keyExists) {
      toast({
        title: "API Key Detected",
        description: "Groq API key has been detected and is ready to use",
        duration: 3000
      });
    } else {
      toast({
        title: "No API Key Found",
        description: "No Groq API key could be found in storage",
        variant: "warning",
        duration: 3000
      });
    }
  }, [checkGroqApiKey]);
  
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
        isSimulationMode,
        manuallySetMode: manuallySetMode.current
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
  
  // Expose the custom setIsSimulationMode function that also persists the setting
  const handleSetSimulationMode = useCallback((newMode: boolean) => {
    console.log('Setting simulation mode to:', newMode);
    manuallySetMode.current = true;
    setIsSimulationMode(newMode);
    saveStockbotSettings({ isSimulationMode: newMode });
  }, []);
  
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey: hasGroqKey,
    isSimulationMode,
    setIsSimulationMode: handleSetSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    reloadApiKeys
  };
};
