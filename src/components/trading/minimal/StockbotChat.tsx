import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { toast } from "@/hooks/use-toast";
import { StockbotKeyDialog } from "./components/stockbot/StockbotKeyDialog";
import { hasApiKey } from "@/utils/apiKeyManager";
import { Button } from "@/components/ui/button";

interface StockbotChatProps {
  hasApiKey?: boolean;
  marketData?: any[];
}

export const StockbotChat = ({ hasApiKey: initialHasApiKey = false, marketData = [] }: StockbotChatProps) => {
  const [isUsingRealData, setIsUsingRealData] = useState(false);
  
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
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
      }, 800);
    } catch (err) {
      console.error("Error in API key success handler:", err);
    }
  };

  const toggleRealData = () => {
    setIsUsingRealData(prev => !prev);
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotHeader 
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={apiKeyStatus.exists}
        isUsingRealData={isUsingRealData}
        toggleRealData={toggleRealData}
        isSimulationMode={false}
        setIsSimulationMode={() => {}}
      />

      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
        {!apiKeyStatus.exists && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-sm text-amber-700 flex justify-between items-center">
            <div className="flex items-center">
              <span>API key required for Stockbot to function</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-white"
              onClick={showApiKeyDialog}
            >
              Configure API Key
            </Button>
          </div>
        )}
        
        {isCheckingAdminKey && (
          <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm text-blue-700 flex items-center">
            <div className="w-4 h-4 mr-2 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Checking Groq API connection...</span>
          </div>
        )}
        
        <StockbotMessages 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          hasApiKey={apiKeyStatus.exists}
          onConfigureApiKey={showApiKeyDialog}
          isUsingRealData={isUsingRealData}
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
