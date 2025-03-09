
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
  const [realMarketData, setRealMarketData] = useState<any[]>([]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveStockbotChatHistory(messages);
  }, [messages]);
  
  // Function to check API key
  const checkApiKey = useCallback(() => {
    const groqKey = localStorage.getItem('groqApiKey');
    const hasKey = !!groqKey && groqKey.trim().length > 0;
    
    console.log("Checking Groq API key:", { 
      exists: hasKey, 
      keyLength: groqKey ? groqKey.length : 0,
      key: groqKey ? `${groqKey.substring(0, 4)}...${groqKey.substring(groqKey.length - 4)}` : 'none'
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
  
  // Fetch real market data periodically
  const fetchRealMarketData = useCallback(async () => {
    try {
      // Check if we have API key before fetching
      const hasKey = checkApiKey();
      if (!hasKey) return;
      
      console.log("Fetching real market data for backtesting...");
      const { data, error } = await supabase.functions.invoke('real-crypto-data');
      
      if (error) {
        console.error("Error fetching real market data:", error);
        return;
      }
      
      if (data && data.success && Array.isArray(data.data)) {
        console.log("Successfully fetched real market data for backtesting:", data.data.length, "items");
        setRealMarketData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch real market data:", err);
    }
  }, [checkApiKey]);
  
  useEffect(() => {
    // Check API key on mount and set simulation mode based on key existence
    const hasKey = checkApiKey();
    setIsSimulationMode(!hasKey);
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      const keyExists = checkApiKey();
      if (keyExists && isSimulationMode) {
        // If key detected and in simulation mode, prompt to switch
        toast({
          title: "Live Mode Available",
          description: "API key detected. Switch to live mode for real data?",
          action: (
            <button 
              onClick={() => setIsSimulationMode(false)}
              className="bg-green-500 text-white px-3 py-1 rounded text-xs"
            >
              Switch Now
            </button>
          ),
          duration: 8000
        });
        
        // Fetch real data when key is added
        fetchRealMarketData();
      }
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    // Set up interval to periodically check for API key updates and fetch data
    const intervalId = setInterval(() => {
      checkApiKey();
      // Only fetch data if we have an API key and not in simulation mode
      if (hasApiKey && !isSimulationMode) {
        fetchRealMarketData();
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
      clearInterval(intervalId);
    };
  }, [checkApiKey, fetchRealMarketData, hasApiKey, isSimulationMode]);

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
    showApiKeyDialog,
    realMarketData
  };
};
