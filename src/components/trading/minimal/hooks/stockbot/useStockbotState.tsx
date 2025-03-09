
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "./types";
import { loadStockbotChatHistory, saveStockbotChatHistory, clearStockbotChatHistory } from "./storage";
import { Button } from "@/components/ui/button";
import { checkApiKeysAvailability, setupApiKeyListener, broadcastApiKeyChange } from "@/hooks/trading-chart/api-key-manager";

export const useStockbotState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStockbotChatHistory());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    checking: boolean;
    lastChecked: number | null;
    available: boolean;
    source: string | null;
  }>({
    checking: true,
    lastChecked: null,
    available: false,
    source: null
  });
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
  const checkApiKey = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setApiStatus(prev => ({ ...prev, checking: true }));
      }
      
      // Check local storage first
      const groqKey = localStorage.getItem('groqApiKey');
      const localKeyExists = !!groqKey && groqKey.trim().length > 0;
      
      console.log("Checking Groq API key:", { 
        exists: localKeyExists, 
        keyLength: groqKey ? groqKey.length : 0,
        key: groqKey ? `${groqKey.substring(0, 4)}...${groqKey.substring(groqKey.length - 4)}` : 'none'
      });
      
      // Then check with Supabase for admin-provided keys
      const result = await checkApiKeysAvailability('groq', true);
      const hasKey = localKeyExists || result.available;
      
      setHasApiKey(hasKey);
      setApiStatus({
        checking: false,
        lastChecked: Date.now(),
        available: hasKey,
        source: localKeyExists ? 'localStorage' : (result.available ? 'supabase' : null)
      });
      
      // If we found a key but are in simulation mode, notify the user
      if (hasKey && isSimulationMode && !silent) {
        toast({
          title: "API Key Detected",
          description: "You can now switch to real AI mode for more accurate responses.",
          duration: 5000,
          action: (
            <Button 
              onClick={() => setIsSimulationMode(false)}
              variant="default"
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Switch Now
            </Button>
          )
        });
      }
      
      return hasKey;
    } catch (error) {
      console.error("Error checking API key:", error);
      
      setApiStatus({
        checking: false,
        lastChecked: Date.now(),
        available: false,
        source: null
      });
      
      if (!silent) {
        toast({
          title: "API Check Failed",
          description: `Could not verify API key availability: ${error.message}`,
          variant: "destructive"
        });
      }
      
      return false;
    }
  }, [isSimulationMode]);
  
  // Fetch real market data periodically
  const fetchRealMarketData = useCallback(async () => {
    try {
      // Check if we have API key before fetching
      const hasKey = await checkApiKey(true);
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
    // Initial API key check
    checkApiKey();
    
    // Set simulation mode based on key existence (will be updated after the check completes)
    setIsSimulationMode(true);
    
    // Set up listener for API key changes from other tabs
    const unsubscribe = setupApiKeyListener((data) => {
      console.log("Received API key update from another tab:", data);
      
      if (data.service === 'groq' || data.service === 'any') {
        // Update local state based on the broadcast
        setHasApiKey(true);
        setApiStatus({
          checking: false,
          lastChecked: data.timestamp,
          available: true,
          source: data.source
        });
        
        // Notify user they can switch to live mode
        if (isSimulationMode) {
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
        }
      }
    });
    
    // Listen for various events that might indicate API key changes
    const handleStorageChange = () => {
      const groqKey = localStorage.getItem('groqApiKey');
      const hasKey = !!groqKey && groqKey.trim().length > 0;
      
      // If the key status has changed, broadcast it
      if (hasKey !== hasApiKey) {
        checkApiKey();
        
        if (hasKey) {
          broadcastApiKeyChange('api-key-updated', 'groq');
        } else {
          broadcastApiKeyChange('api-key-removed', 'groq');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Regular check interval
    const checkInterval = setInterval(() => {
      checkApiKey(true);
      
      // Only fetch data if we have an API key and not in simulation mode
      if (hasApiKey && !isSimulationMode) {
        fetchRealMarketData();
      }
    }, 30000); // Check every 30 seconds
    
    // Initial fetch of market data
    fetchRealMarketData();
    
    return () => {
      clearInterval(checkInterval);
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
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
  
  const handleSetApiKey = useCallback((apiKey: string) => {
    try {
      // Save to localStorage
      localStorage.setItem('groqApiKey', apiKey);
      
      // Broadcast the change
      broadcastApiKeyChange('api-key-updated', 'groq');
      
      // Update local state
      setHasApiKey(true);
      setApiStatus(prev => ({
        ...prev,
        available: true,
        source: 'localStorage',
        lastChecked: Date.now()
      }));
      
      // Check API key and potentially fetch market data
      checkApiKey();
      
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved successfully."
      });
      
      // Close dialog and switch to live mode
      setIsKeyDialogOpen(false);
      setIsSimulationMode(false);
      
      return true;
    } catch (error) {
      console.error("Error saving API key:", error);
      
      toast({
        title: "Error",
        description: "Failed to save API key: " + error.message,
        variant: "destructive"
      });
      
      return false;
    }
  }, [checkApiKey]);

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
  
  // Force check API key - called from UI
  const forceCheckApiKey = useCallback(() => {
    checkApiKey();
  }, [checkApiKey]);
  
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
    realMarketData,
    apiStatus,
    forceCheckApiKey,
    setApiKey: handleSetApiKey
  };
};
