
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "./types";
import { loadStockbotChatHistory, saveStockbotChatHistory, clearStockbotChatHistory } from "./storage";
import { Button } from "@/components/ui/button";
import { checkApiKeysAvailability } from "@/hooks/trading-chart/api-key-manager";

export const useStockbotState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStockbotChatHistory());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [realMarketData, setRealMarketData] = useState<any[]>([]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      saveStockbotChatHistory(messages);
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  }, [messages]);
  
  // Function to check API key
  const checkApiKey = useCallback(() => {
    try {
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
    } catch (error) {
      console.error("Error checking API key:", error);
      return false;
    }
  }, [isSimulationMode]);
  
  // Fetch real market data periodically
  const fetchRealMarketData = useCallback(async () => {
    try {
      // Check if we have API key before fetching
      const hasKey = checkApiKey();
      if (!hasKey) return;
      
      console.log("Fetching real market data for backtesting...");
      
      try {
        const response = await fetch("/api/real-crypto-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && data.success && Array.isArray(data.data)) {
          console.log("Successfully fetched real market data for backtesting:", data.data.length, "items");
          setRealMarketData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch real market data:", err);
        // Fallback to sample data if real data fetch fails
        const sampleData = generateSampleMarketData();
        setRealMarketData(sampleData);
      }
    } catch (err) {
      console.error("Failed to fetch real market data:", err);
    }
  }, [checkApiKey]);
  
  useEffect(() => {
    // Check API key on mount and set simulation mode based on key existence
    try {
      const hasKey = checkApiKey();
      setIsSimulationMode(!hasKey);
      
      // Listen for API key updates - both from this tab and from other tabs
      const handleApiKeyUpdate = () => {
        const keyExists = checkApiKey();
        if (keyExists && isSimulationMode) {
          // If key detected and in simulation mode, prompt to switch
          toast({
            title: "Live Mode Available",
            description: "API key detected. Switch to live mode for real data?",
            action: (
              <Button 
                onClick={() => setIsSimulationMode(false)}
                variant="default"
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Switch Now
              </Button>
            ),
            duration: 8000
          });
          
          // Fetch real data when key is added
          fetchRealMarketData();
        }
      };
      
      // Listen for various events that might indicate API key changes
      window.addEventListener('apikey-updated', handleApiKeyUpdate);
      window.addEventListener('localStorage-changed', handleApiKeyUpdate);
      window.addEventListener('storage', handleApiKeyUpdate);
      window.addEventListener('api-key-changed', handleApiKeyUpdate);
      
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
        window.removeEventListener('api-key-changed', handleApiKeyUpdate);
        clearInterval(intervalId);
      };
    } catch (error) {
      console.error("Error in useStockbotState useEffect:", error);
      setIsSimulationMode(true); // Fallback to simulation mode on error
    }
  }, [checkApiKey, fetchRealMarketData, hasApiKey, isSimulationMode]);

  const clearChat = useCallback(() => {
    try {
      setMessages([]);
      clearStockbotChatHistory();
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
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

  // Generate sample market data if real data fetch fails
  const generateSampleMarketData = () => {
    return [
      { symbol: "BTC", price: 38500, change: 2.5 },
      { symbol: "ETH", price: 2100, change: -1.2 },
      { symbol: "SOL", price: 75, change: 5.3 },
      { symbol: "ADA", price: 0.45, change: 1.1 },
      { symbol: "DOT", price: 6.2, change: -0.8 }
    ];
  };
  
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
