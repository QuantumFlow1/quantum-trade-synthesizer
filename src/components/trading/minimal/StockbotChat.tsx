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
    hasApiKey: hookHasApiKey,
    isCheckingAdminKey
  } = useStockbotChat(marketData);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState({ exists: initialHasApiKey || hookHasApiKey });
  const dialogCloseTimeoutRef = useRef<number | null>(null);
  const keyCheckInProgress = useRef(false);
  const lastKeyUpdateTime = useRef(0);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const checkKey = () => {
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
    
    checkKey();
    
    let lastEventTime = 0;
    const handleApiKeyChange = () => {
      const now = Date.now();
      if (now - lastEventTime < 1000) return;
      
      lastEventTime = now;
      setTimeout(() => {
        if (!keyCheckInProgress.current) {
          checkKey();
        }
      }, 300);
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
    
    if (dialogCloseTimeoutRef.current) {
      clearTimeout(dialogCloseTimeoutRef.current);
    }
    
    setIsKeyDialogOpen(false);
    
    dialogCloseTimeoutRef.current = window.setTimeout(() => {
      dialogCloseTimeoutRef.current = null;
      
      try {
        const keyExists = hasApiKey('groq');
        const groqKeyValue = localStorage.getItem('groqApiKey');
        
        console.log('Dialog closed, API key status:', {
          exists: keyExists,
          keyLength: groqKeyValue ? groqKeyValue.length : 0,
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
        
        setTimeout(reloadApiKeys, 300);
      } catch (err) {
        console.error("Error handling dialog close:", err);
      }
    }, 500);
  };

  const handleApiKeySuccess = () => {
    console.log("API key saved successfully, refreshing state");
    
    try {
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
          timestamp: new Date().toISOString()
        });
        
        setApiKeyStatus({ exists: keyExists });
        
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
          isCheckingAdminKey={isCheckingAdminKey}
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
