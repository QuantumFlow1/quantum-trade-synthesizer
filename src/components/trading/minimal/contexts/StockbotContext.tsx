
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { useStockbotChat } from "../hooks/useStockbotChat";
import { hasApiKey } from "@/utils/apiKeyManager";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type StockbotContextType = {
  messages: any[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
  showApiKeyDialog: () => void;
  isKeyDialogOpen: boolean;
  setIsKeyDialogOpen: (open: boolean) => void;
  reloadApiKeys: () => void;
  apiKeyStatus: { exists: boolean };
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleDialogClose: () => void;
  handleApiKeySuccess: () => void;
};

const StockbotContext = createContext<StockbotContextType | undefined>(undefined);

export const StockbotProvider = ({ children, marketData = [] }: { children: ReactNode, marketData?: any[] }) => {
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    isSimulationMode, 
    setIsSimulationMode, 
    handleSendMessage, 
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    reloadApiKeys,
    hasApiKey: hookHasApiKey
  } = useStockbotChat(marketData);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState({ exists: hookHasApiKey });
  const dialogCloseTimeoutRef = useRef<number | null>(null);
  const keyCheckInProgress = useRef(false);
  const lastKeyUpdateTime = useRef(0);
  
  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Immediately check if key exists in localStorage on mount
  useEffect(() => {
    const localKeyExists = hasApiKey('groq');
    const groqKey = localStorage.getItem('groqApiKey');
    
    console.log('StockbotContext - Initial API key check on mount:', {
      exists: localKeyExists,
      keyLength: groqKey ? groqKey.length : 0,
      firstCheck: true
    });
    
    if (localKeyExists && groqKey && groqKey.trim().length > 0) {
      setApiKeyStatus({ exists: true });
    }
  }, []);

  // Update API key status when any relevant state changes
  useEffect(() => {
    const checkKey = () => {
      // Prevent multiple simultaneous checks and throttle checks
      const now = Date.now();
      if (keyCheckInProgress.current || now - lastKeyUpdateTime.current < 1000) {
        return false;
      }
      
      keyCheckInProgress.current = true;
      lastKeyUpdateTime.current = now;
      
      try {
        const keyExists = hasApiKey('groq');
        const groqKeyValue = localStorage.getItem('groqApiKey');
        
        console.log('StockbotChat - API key check:', {
          exists: keyExists,
          keyLength: groqKeyValue ? groqKeyValue.length : 0,
          previous: apiKeyStatus.exists,
          timestamp: new Date().toISOString()
        });
        
        if (keyExists !== apiKeyStatus.exists) {
          console.log('StockbotChat - API key status changed:', { 
            exists: keyExists, 
            previous: apiKeyStatus.exists,
            timestamp: new Date().toISOString()
          });
          setApiKeyStatus({ exists: keyExists });
        }
        
        keyCheckInProgress.current = false;
        return keyExists;
      } catch (err) {
        console.error("Error checking API key:", err);
        keyCheckInProgress.current = false;
        return false;
      }
    };
    
    // Immediate check
    checkKey();
    
    // Set up event listeners for API key changes with throttling
    let lastEventTime = 0;
    const handleApiKeyChange = () => {
      const now = Date.now();
      if (now - lastEventTime < 1000) return; // Debounce events that fire too rapidly
      
      lastEventTime = now;
      setTimeout(() => {
        if (!keyCheckInProgress.current) {
          checkKey();
        }
      }, 300);
    };
    
    window.addEventListener('apikey-updated', handleApiKeyChange);
    window.addEventListener('localStorage-changed', handleApiKeyChange);
    window.addEventListener('storage', handleApiKeyChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyChange);
      window.removeEventListener('localStorage-changed', handleApiKeyChange);
      window.removeEventListener('storage', handleApiKeyChange);
    };
  }, [apiKeyStatus.exists, hookHasApiKey]);

  const handleDialogClose = () => {
    console.log("Dialog closing, checking for API key");
    
    // Clear any existing timeout
    if (dialogCloseTimeoutRef.current) {
      clearTimeout(dialogCloseTimeoutRef.current);
    }
    
    // Set dialog closed first to prevent UI freeze
    setIsKeyDialogOpen(false);
    
    // Force a direct check with a slight delay to ensure storage is updated
    dialogCloseTimeoutRef.current = window.setTimeout(() => {
      // Clear timeout reference
      dialogCloseTimeoutRef.current = null;
      
      try {
        const keyExists = hasApiKey('groq');
        const groqKeyValue = localStorage.getItem('groqApiKey');
        
        console.log('Dialog closed, API key status:', {
          exists: keyExists,
          keyLength: groqKeyValue ? groqKeyValue.length : 0,
          keyValue: groqKeyValue ? `${groqKeyValue.substring(0, 3)}...${groqKeyValue.substring(groqKeyValue.length - 3)}` : null,
          timestamp: new Date().toISOString()
        });
        
        setApiKeyStatus({ exists: keyExists });
        
        if (keyExists) {
          toast({
            title: "API Key Detected",
            description: "Groq API key has been configured successfully",
            duration: 3000
          });
        }
        
        // Additional delay before reloading API keys
        setTimeout(reloadApiKeys, 300);
      } catch (err) {
        console.error("Error handling dialog close:", err);
      }
    }, 500);
  };

  const handleApiKeySuccess = () => {
    // Execute additional logic after a successful API key save
    console.log("API key saved successfully, refreshing state");
    
    try {
      // Check for API key with a slight delay to ensure storage is updated
      setTimeout(() => {
        if (dialogCloseTimeoutRef.current) {
          clearTimeout(dialogCloseTimeoutRef.current);
          dialogCloseTimeoutRef.current = null;
        }
        
        const keyExists = hasApiKey('groq');
        const groqKeyValue = localStorage.getItem('groqApiKey');
        
        console.log('API key success callback, status:', {
          exists: keyExists,
          keyLength: groqKeyValue ? groqKeyValue.length : 0,
          keyValue: groqKeyValue ? `${groqKeyValue.substring(0, 3)}...${groqKeyValue.substring(groqKeyValue.length - 3)}` : null,
          timestamp: new Date().toISOString()
        });
        
        setApiKeyStatus({ exists: keyExists });
        
        // If we have a key and are in simulation mode, offer to switch
        if (keyExists && isSimulationMode) {
          toast({
            title: "API Key Configured",
            description: "Switch to AI mode to use your Groq API key",
            duration: 5000,
            action: (
              <Button 
                onClick={() => setIsSimulationMode(false)}
                variant="default"
                size="sm"
              >
                Switch Now
              </Button>
            )
          });
        }
      }, 800);
    } catch (err) {
      console.error("Error in API key success handler:", err);
    }
  };

  return (
    <StockbotContext.Provider
      value={{
        messages,
        inputMessage,
        setInputMessage,
        isLoading,
        isSimulationMode,
        setIsSimulationMode,
        handleSendMessage,
        clearChat,
        showApiKeyDialog,
        isKeyDialogOpen,
        setIsKeyDialogOpen,
        reloadApiKeys,
        apiKeyStatus,
        messagesEndRef,
        handleDialogClose,
        handleApiKeySuccess
      }}
    >
      {children}
    </StockbotContext.Provider>
  );
};

export const useStockbot = () => {
  const context = useContext(StockbotContext);
  if (context === undefined) {
    throw new Error("useStockbot must be used within a StockbotProvider");
  }
  return context;
};
