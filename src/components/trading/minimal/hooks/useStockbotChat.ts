
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./stockbot/types";
import { generateStockbotResponse } from "./stockbot/responseSimulator";

export type { ChatMessage } from "./stockbot/types";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Check for API key on mount
  useEffect(() => {
    const checkApiKey = () => {
      const key = localStorage.getItem('groqApiKey');
      setHasApiKey(!!key && key.length > 0);
    };
    
    checkApiKey();
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  }, []);
  
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
      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on message content
      const assistantMessage = generateStockbotResponse(inputMessage, marketData);
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error handling message:", error);
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
