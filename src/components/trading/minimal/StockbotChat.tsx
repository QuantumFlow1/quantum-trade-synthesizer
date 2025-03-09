
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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  const [apiKeyStatus, setApiKeyStatus] = useState({ exists: initialHasApiKey, keyLength: 0 });
  const [keyRecheckCount, setKeyRecheckCount] = useState(0);

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
      
      console.log("StockbotChat - API Key Status Check #" + keyRecheckCount, { 
        exists: keyExists, 
        keyLength: actualApiKey ? actualApiKey.trim().length : 0,
        key: actualApiKey ? `${actualApiKey.substring(0, 4)}...${actualApiKey.substring(actualApiKey.length - 4)}` : 'none'
      });
      
      setKeyRecheckCount(prev => prev + 1);
    };

    checkApiKey();

    const handleStorageChange = () => {
      console.log("Storage change detected in StockbotChat");
      checkApiKey();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);

    const intervalId = setInterval(checkApiKey, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [keyRecheckCount]);

  // Also update when hasApiKey from hook changes
  useEffect(() => {
    console.log("hasApiKey changed in hook:", hasApiKey);
    if (hasApiKey !== apiKeyStatus.exists) {
      const actualApiKey = localStorage.getItem("groqApiKey");
      setApiKeyStatus({
        exists: hasApiKey,
        keyLength: actualApiKey ? actualApiKey.trim().length : 0
      });
    }
  }, [hasApiKey, apiKeyStatus.exists]);

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
    
    // Force a reload of all API keys
    reloadApiKeys();
  };
  
  const handleForceReload = () => {
    console.log("Forcing API key reload");
    reloadApiKeys();
    
    // Also check again right now
    const actualApiKey = localStorage.getItem("groqApiKey");
    const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
    
    setApiKeyStatus({
      exists: keyExists,
      keyLength: actualApiKey ? actualApiKey.trim().length : 0
    });
    
    toast({
      title: "API Status Refreshed",
      description: keyExists 
        ? "Groq API key detected, length: " + (actualApiKey?.length || 0) + " characters" 
        : "No Groq API key found in storage",
      duration: 3000
    });
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
              <div className="flex flex-wrap gap-2 mt-1">
                <button 
                  onClick={showApiKeyDialog}
                  className="text-amber-800 underline font-medium self-start"
                >
                  Configure API Key
                </button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleForceReload}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh Status
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiKeyStatus.exists && !isSimulationMode && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-700 m-3">
            <AlertTitle>API Key Configured</AlertTitle>
            <AlertDescription className="flex flex-col gap-1">
              <p>Your Groq API key is set up and ready to use with Stockbot.</p>
              <div className="text-xs text-green-600 mt-1">
                Key length: {apiKeyStatus.keyLength} characters
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isSimulationMode && (
          <Alert variant="warning" className="m-3">
            <AlertTitle>Simulation Mode Active</AlertTitle>
            <AlertDescription>
              <p>Stockbot is using simulated responses instead of real AI analysis.</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {apiKeyStatus.exists && (
                  <button 
                    onClick={() => setIsSimulationMode(false)}
                    className="text-amber-800 underline font-medium"
                  >
                    Switch to real AI mode
                  </button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleForceReload}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh API Status
                </Button>
              </div>
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
