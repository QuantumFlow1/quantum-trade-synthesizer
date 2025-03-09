
import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/StockbotInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";

export const StockbotChat = () => {
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    hasApiKey, 
    isSimulationMode, 
    setIsSimulationMode, 
    handleSendMessage, 
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen
  } = useStockbotChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={hasApiKey}
      />

      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
        {!hasApiKey && !isSimulationMode && (
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
          hasApiKey={hasApiKey}
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
