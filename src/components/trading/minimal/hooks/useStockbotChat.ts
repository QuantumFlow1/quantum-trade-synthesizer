
import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotChatHook } from "./stockbot/types";

export type { ChatMessage } from "./stockbot/types";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Check for API key on mount
  useState(() => {
    const checkApiKey = () => {
      const key = localStorage.getItem('groqApiKey');
      setHasApiKey(!!key && key.length > 0);
    };
    
    checkApiKey();
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  });
  
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
      text: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate response based on message content
      let responseText = "I'm your trading assistant. How can I help you today?";
      
      if (inputMessage.toLowerCase().includes('price')) {
        const price = marketData && marketData.length > 0 
          ? marketData[marketData.length - 1].close 
          : 43500.75;
        responseText = `Based on the latest data, Bitcoin is trading at $${price.toFixed(2)}.`;
      } else if (inputMessage.toLowerCase().includes('market')) {
        responseText = "The market has been showing increased volatility. It's important to manage risk and avoid emotional decisions.";
      } else if (inputMessage.toLowerCase().includes('strategy')) {
        responseText = "For a good trading strategy, consider dollar-cost averaging and setting clear stop-loss levels. Would you like me to explain more?";
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      
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
