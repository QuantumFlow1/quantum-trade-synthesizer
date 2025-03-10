
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { toast } from "@/hooks/use-toast";
import { StockbotAlerts } from "./components/stockbot/StockbotAlerts";
import { StockbotKeyDialog } from "./components/stockbot/StockbotKeyDialog";
import { hasApiKey } from "@/utils/apiKeyManager";
import { Button } from "@/components/ui/button";

interface StockbotChatProps {
  hasApiKey?: boolean;
  marketData?: any[];
}

export const StockbotChat = ({ hasApiKey: initialHasApiKey = false, marketData = [] }: StockbotChatProps) => {
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
  const [apiKeyStatus, setApiKeyStatus] = useState({ exists: initialHasApiKey || hookHasApiKey });
  const dialogCloseTimeoutRef = useRef<number | null>(null);
  const keyCheckInProgress = useRef(false);
  
  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Update API key status when any relevant state changes
  useEffect(() => {
    const checkKey = () => {
      // Prevent multiple simultaneous checks
      if (keyCheckInProgress.current) return;
      
      keyCheckInProgress.current = true;
      const keyExists = hasApiKey('groq');
      const groqKeyValue = localStorage.getItem('groqApiKey');
      
      console.log('StockbotChat - API key check:', {
        exists: keyExists,
        keyLength: groqKeyValue ? groqKeyValue.length : 0,
        previous: apiKeyStatus.exists
      });
      
      if (keyExists !== apiKeyStatus.exists) {
        console.log('StockbotChat - API key status changed:', { exists: keyExists, previous: apiKeyStatus.exists });
        setApiKeyStatus({ exists: keyExists });
      }
      
      keyCheckInProgress.current = false;
      return keyExists;
    };
    
    // Immediate check
    checkKey();
    
    // Set up event listeners for API key changes with throttling
    let lastEventTime = 0;
    const handleApiKeyChange = () => {
      const now = Date.now();
      if (now - lastEventTime < 500) return; // Debounce events that fire too rapidly
      
      lastEventTime = now;
      setTimeout(() => {
        if (!keyCheckInProgress.current) {
          checkKey();
        }
      }, 100);
    };
    
    window.addEventListener('apikey-updated', handleApiKeyChange);
    window.addEventListener('localStorage-changed', handleApiKeyChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyChange);
      window.removeEventListener('localStorage-changed', handleApiKeyChange);
    };
  }, [apiKeyStatus.exists, hookHasApiKey]);

  const handleDialogClose = () => {
    console.log("Dialog closing, checking for API key");
    
    // Clear any existing timeout
    if (dialogCloseTimeoutRef.current) {
      clearTimeout(dialogCloseTimeoutRef.current);
    }
    
    setIsKeyDialogOpen(false);
    
    // Force a direct check with a slight delay to ensure storage is updated
    dialogCloseTimeoutRef.current = window.setTimeout(() => {
      const keyExists = hasApiKey('groq');
      const groqKeyValue = localStorage.getItem('groqApiKey');
      
      console.log('Dialog closed, API key status:', {
        exists: keyExists,
        keyLength: groqKeyValue ? groqKeyValue.length : 0
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
    }, 200);
  };

  const handleApiKeySuccess = () => {
    // Execute additional logic after a successful API key save
    console.log("API key saved successfully, refreshing state");
    
    // Check for API key with a slight delay to ensure storage is updated
    setTimeout(() => {
      const keyExists = hasApiKey('groq');
      const groqKeyValue = localStorage.getItem('groqApiKey');
      
      console.log('API key success callback, status:', {
        exists: keyExists,
        keyLength: groqKeyValue ? groqKeyValue.length : 0
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
    }, 500);
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={apiKeyStatus.exists}
      />

      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
        <StockbotAlerts
          hasApiKey={apiKeyStatus.exists}
          isSimulationMode={isSimulationMode}
          showApiKeyDialog={showApiKeyDialog}
          setIsSimulationMode={setIsSimulationMode}
          handleForceReload={reloadApiKeys}
        />
        
        <StockbotMessages 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          hasApiKey={apiKeyStatus.exists}
          onConfigureApiKey={showApiKeyDialog}
        />
        
        <StockbotInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>

      <StockbotKeyDialog
        isKeyDialogOpen={isKeyDialogOpen}
        handleDialogClose={handleDialogClose}
        onSuccessfulSave={handleApiKeySuccess}
      />
    </Card>
  );
};
