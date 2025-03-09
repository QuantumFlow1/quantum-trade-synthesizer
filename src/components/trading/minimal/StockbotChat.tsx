
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check for API key in localStorage and keep updated
  useEffect(() => {
    const checkApiKey = () => {
      const actualApiKey = localStorage.getItem("groqApiKey");
      setApiKeyStatus({
        exists: !!actualApiKey,
        keyLength: actualApiKey ? actualApiKey.length : 0
      });
    };

    // Initial check
    checkApiKey();

    // Set up event listener for local storage changes
    const handleStorageChange = () => checkApiKey();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);

    // Set an interval to periodically check for API key updates
    const intervalId = setInterval(checkApiKey, 1000);

    // Log the API key status for debugging
    console.log("API Key Status:", { 
      hasApiKeyProp: hasApiKey, 
      actualKeyExists: apiKeyStatus.exists,
      apiKeyLength: apiKeyStatus.keyLength
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [hasApiKey]);

  // Handle API key dialog close - check if key was added
  const handleDialogClose = () => {
    setIsKeyDialogOpen(false);
    
    // Force a check for the API key
    const actualApiKey = localStorage.getItem("groqApiKey");
    const keyExists = !!actualApiKey;
    
    setApiKeyStatus({
      exists: keyExists,
      keyLength: actualApiKey ? actualApiKey.length : 0
    });
    
    if (keyExists) {
      toast({
        title: "API Key Detected",
        description: "Groq API key has been configured successfully",
        duration: 3000
      });
      
      // Turn off simulation mode if we have a key
      if (isSimulationMode) {
        setIsSimulationMode(false);
      }
    }
    
    // Trigger events to notify other components
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={apiKeyStatus.exists} // Use the local state
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
          hasApiKey={apiKeyStatus.exists} // Use the local state
          onConfigureApiKey={showApiKeyDialog}
        />
        
        <StockbotInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>

      {/* API Key Configuration Dialog */}
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
