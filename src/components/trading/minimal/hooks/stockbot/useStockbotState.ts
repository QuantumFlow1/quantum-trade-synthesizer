
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "./types";
import { loadStockbotChatHistory, saveStockbotChatHistory, clearStockbotChatHistory } from "./storage";

export const useStockbotState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStockbotChatHistory());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveStockbotChatHistory(messages);
  }, [messages]);
  
  // Function to check API key
  const checkApiKey = useCallback(() => {
    const groqKey = localStorage.getItem('groqApiKey');
    const hasKey = !!groqKey;
    
    console.log("Checking Groq API key:", { 
      exists: hasKey, 
      keyLength: groqKey ? groqKey.length : 0 
    });
    
    setHasApiKey(hasKey);
    
    // If we have a key but are in simulation mode, notify the user
    if (hasKey && isSimulationMode) {
      toast({
        title: "API Key Detected",
        description: "You can now switch to real AI mode for more accurate responses.",
        duration: 5000
      });
    }
    
    return hasKey;
  }, [isSimulationMode]);
  
  useEffect(() => {
    // Check API key on mount and set simulation mode based on key existence
    const hasKey = checkApiKey();
    setIsSimulationMode(!hasKey);
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    // Set an interval to periodically check for API key updates
    const intervalId = setInterval(checkApiKey, 2000);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      clearInterval(intervalId);
    };
  }, [checkApiKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    clearStockbotChatHistory();
  }, []);
  
  const showApiKeyDialog = () => {
    setIsKeyDialogOpen(true);
  };
  
  // Custom setMessages function that also saves to localStorage
  const handleSetMessages = useCallback((messagesOrUpdater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setMessages(messagesOrUpdater);
    // We don't need to explicitly call saveStockbotChatHistory here
    // because the useEffect above will handle it whenever messages change
  }, []);
  
  return {
    messages,
    setMessages: handleSetMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    clearChat,
    showApiKeyDialog
  };
};
