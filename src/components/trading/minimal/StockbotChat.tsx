
import { useStockbotChat } from "../hooks/useStockbotChat";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StockbotHeader } from "./components/StockbotHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export function StockbotChat() {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearMessages,
    hasApiKey,
    setHasApiKey,
    isUsingRealData,
    toggleRealData
  } = useStockbotChat();

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      handleSubmit(e as unknown as React.FormEvent);
    }
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
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              className="flex-1"
              placeholder="Stel een vraag over de markt..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
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

export default StockbotChat;
