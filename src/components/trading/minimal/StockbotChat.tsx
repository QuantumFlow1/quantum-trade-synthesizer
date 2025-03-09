
import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";

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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check for API key in localStorage directly to double-check
  const actualApiKey = localStorage.getItem("groqApiKey");
  const apiKeyExists = !!actualApiKey;
  
  // Log the API key status for debugging
  useEffect(() => {
    console.log("API Key Status:", { 
      hasApiKeyProp: hasApiKey, 
      actualKeyExists: apiKeyExists,
      apiKeyLength: actualApiKey ? actualApiKey.length : 0
    });
  }, [hasApiKey, apiKeyExists, actualApiKey]);

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={apiKeyExists} // Use direct check rather than prop
      />

      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
        {!apiKeyExists && !isSimulationMode && (
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

        {apiKeyExists && !isSimulationMode && (
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
            </AlertDescription>
          </Alert>
        )}
        
        <StockbotMessages 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          hasApiKey={apiKeyExists} // Use direct check rather than prop
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
      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <ApiKeyDialogContent 
            initialTab="groq"
            onClose={() => setIsKeyDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
