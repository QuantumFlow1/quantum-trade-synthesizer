
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";

interface StockbotChatProps {
  hasApiKey: boolean;
  marketData?: any[];
}

export const StockbotChat = ({ hasApiKey, marketData = [] }: StockbotChatProps) => {
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
    setIsKeyDialogOpen
  } = useStockbotChat(marketData);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState({ exists: false, keyLength: 0 });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const checkApiKey = () => {
      const actualApiKey = localStorage.getItem("groqApiKey");
      const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
      
      setApiKeyStatus({
        exists: keyExists,
        keyLength: actualApiKey ? actualApiKey.trim().length : 0
      });
      
      console.log("StockbotChat - API Key Status:", { 
        exists: keyExists, 
        keyLength: actualApiKey ? actualApiKey.trim().length : 0,
        key: actualApiKey ? `${actualApiKey.substring(0, 4)}...${actualApiKey.substring(actualApiKey.length - 4)}` : 'none'
      });
    };

    checkApiKey();

    const handleStorageChange = () => {
      console.log("Storage change detected in StockbotChat");
      checkApiKey();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);

    const intervalId = setInterval(checkApiKey, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleDialogClose = () => {
    setIsKeyDialogOpen(false);
    
    const actualApiKey = localStorage.getItem("groqApiKey");
    const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
    
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
      
      if (isSimulationMode) {
        setIsSimulationMode(false);
      }
    }
    
    // Force event triggering to ensure other components are notified
    console.log("Dispatching events after dialog close");
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
    window.dispatchEvent(new Event('storage'));
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
        {!apiKeyStatus.exists && !isSimulationMode && (
          <Alert variant="warning" className="m-3">
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>Please set your Groq API key to enable full Stockbot functionality.</p>
              <button 
                onClick={showApiKeyDialog}
                className="text-amber-800 underline font-medium self-start"
              >
                Configure API Key
              </button>
            </AlertDescription>
          </Alert>
        )}

        {apiKeyStatus.exists && !isSimulationMode && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-700 m-3">
            <AlertTitle>API Key Configured</AlertTitle>
            <AlertDescription>
              Your Groq API key is set up and ready to use with Stockbot.
            </AlertDescription>
          </Alert>
        )}

        {isSimulationMode && (
          <Alert variant="warning" className="m-3">
            <AlertTitle>Simulation Mode Active</AlertTitle>
            <AlertDescription>
              Stockbot is using simulated responses instead of real AI analysis.
              {apiKeyStatus.exists && (
                <p className="mt-1">
                  <button 
                    onClick={() => setIsSimulationMode(false)}
                    className="text-amber-800 underline font-medium"
                  >
                    Switch to real AI mode
                  </button>
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
        
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

      <Dialog open={isKeyDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <ApiKeyDialogContent 
            initialTab="groq"
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
