
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { toast } from "@/hooks/use-toast";
import { StockbotAlerts } from "./components/stockbot/StockbotAlerts";
import { StockbotKeyDialog } from "./components/stockbot/StockbotKeyDialog";
import { useApiKeyStatus } from "./hooks/useApiKeyStatus";

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
    hasApiKey
  } = useStockbotChat(marketData);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { apiKeyStatus, setApiKeyStatus, handleForceReload } = useApiKeyStatus(initialHasApiKey, reloadApiKeys);
  const [processingApiKey, setProcessingApiKey] = useState(false);
  const [keyChangeCounter, setKeyChangeCounter] = useState(0);

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Also update when hasApiKey from hook changes
  useEffect(() => {
    console.log("hasApiKey changed in hook:", hasApiKey);
    if (hasApiKey !== apiKeyStatus.exists) {
      const actualApiKey = localStorage.getItem("groqApiKey");
      console.log("Updating API key status:", { 
        exists: !!actualApiKey, 
        keyLength: actualApiKey ? actualApiKey.trim().length : 0 
      });
      
      setApiKeyStatus({
        exists: !!actualApiKey,
        keyLength: actualApiKey ? actualApiKey.trim().length : 0
      });
    }
  }, [hasApiKey, apiKeyStatus.exists, setApiKeyStatus]);

  // Check localStorage directly for changes
  useEffect(() => {
    const checkStorage = () => {
      const groqKey = localStorage.getItem("groqApiKey");
      const exists = !!groqKey && groqKey.trim().length > 0;
      
      console.log("Direct localStorage check:", {
        exists,
        keyLength: groqKey ? groqKey.trim().length : 0
      });
      
      if (exists !== apiKeyStatus.exists) {
        setApiKeyStatus({
          exists,
          keyLength: groqKey ? groqKey.trim().length : 0
        });
        setKeyChangeCounter(prev => prev + 1);
      }
    };
    
    const interval = setInterval(checkStorage, 2000);
    
    return () => clearInterval(interval);
  }, [setApiKeyStatus, apiKeyStatus.exists]);

  const handleDialogClose = () => {
    console.log("Dialog closing, checking for API key");
    setIsKeyDialogOpen(false);
    
    if (processingApiKey) return;
    setProcessingApiKey(true);
    
    try {
      // Force a direct check of localStorage
      const actualApiKey = localStorage.getItem("groqApiKey");
      const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
      
      console.log("API key after dialog close:", {
        exists: keyExists,
        length: actualApiKey ? actualApiKey.trim().length : 0
      });
      
      setApiKeyStatus({
        exists: keyExists,
        keyLength: actualApiKey ? actualApiKey.trim().length : 0
      });
      
      if (keyExists) {
        toast({
          title: "API Key Detected",
          description: "Groq API key has been configured successfully",
          duration: 3000
        });
      }
      
      // Force event triggering to ensure other components are notified
      window.dispatchEvent(new Event('apikey-updated'));
      window.dispatchEvent(new Event('localStorage-changed'));
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error("Error handling dialog close:", error);
    } finally {
      // Force a reload of all API keys
      setTimeout(() => {
        reloadApiKeys();
        setProcessingApiKey(false);
      }, 300);
    }
  };

  const handleApiKeySuccess = () => {
    // Execute additional logic after a successful API key save
    setTimeout(() => {
      console.log("API key saved successfully, refreshing state");
      handleForceReload();
      setKeyChangeCounter(prev => prev + 1);
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
          handleForceReload={handleForceReload}
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
