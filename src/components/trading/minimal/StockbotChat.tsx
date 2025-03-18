
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { useStockbotState } from "./hooks/stockbot/useStockbotState";

export function StockbotChat() {
  const {
    messages,
    inputMessage: input,
    setInputMessage: setInput,
    isLoading,
    handleSendMessage: handleSubmit,
    clearChat: clearMessages
  } = useStockbotState();

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isUsingRealData, setIsUsingRealData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for API key in localStorage on component mount
    const storedKey = localStorage.getItem("stockbot-api-key");
    setHasApiKey(!!storedKey);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("stockbot-api-key", apiKey.trim());
      setHasApiKey(true);
      setShowApiKeyDialog(false);
      setApiKey("");
    }
  };

  const clearChat = () => {
    clearMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRealData = () => {
    setIsUsingRealData(!isUsingRealData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <Card className="flex flex-col h-full border-muted-foreground/20">
        <StockbotHeader
          clearChat={clearChat}
          showApiKeyDialog={() => setShowApiKeyDialog(true)}
          hasApiKey={hasApiKey}
          isUsingRealData={isUsingRealData}
          toggleRealData={toggleRealData}
          isSimulationMode={isSimulationMode}
          setIsSimulationMode={setIsSimulationMode}
        />
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-[400px] px-4">
            <div className="space-y-4 pt-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="mx-auto h-12 w-12 mb-2 text-primary/50" />
                  <p>Hallo! Ik ben Stockbot, je financiële assistent.</p>
                  <p className="text-sm">Stel me een vraag over aandelen, crypto, of marktgegevens.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs font-semibold">
                          {message.role === "user" ? "Jij" : "Stockbot"}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex space-x-2">
            <Input
              className="flex-1"
              placeholder="Stel een vraag over de markt..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Sleutel Configuratie</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Voer je API sleutel in om toegang te krijgen tot realtime marktgegevens.
            </p>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Sleutel"
              type="password"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleSaveApiKey}>Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Loading spinner component since @/components/ui/spinner is missing
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// StockbotHeader component
function StockbotHeader({
  clearChat,
  showApiKeyDialog,
  hasApiKey,
  isUsingRealData,
  toggleRealData,
  isSimulationMode,
  setIsSimulationMode
}: {
  clearChat: () => void;
  showApiKeyDialog: () => void;
  hasApiKey: boolean;
  isUsingRealData: boolean;
  toggleRealData: () => void;
  isSimulationMode: boolean;
  setIsSimulationMode: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <Bot className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-semibold">Stockbot</h3>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleRealData}
          disabled={!hasApiKey}
        >
          {isUsingRealData ? "Simulatie" : "Live data"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={showApiKeyDialog}
        >
          API sleutel
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsSimulationMode(!isSimulationMode)}
        >
          {isSimulationMode ? "Simulatie uit" : "Simulatie aan"}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
        >
          Wissen
        </Button>
      </div>
    </div>
  );
}

export default StockbotChat;
