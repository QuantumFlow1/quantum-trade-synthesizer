
import React, { useState, useRef, useEffect } from "react";
import { StockbotMessageList } from "./StockbotMessageList";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Settings } from "lucide-react";
import { useStockbotState } from "../../hooks/stockbot/useStockbotState";
import { Spinner } from "@/components/ui/spinner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function StockbotChat() {
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    handleSendMessage,
    clearChat,
    currentModel,
    setCurrentModel,
    availableModels
  } = useStockbotState();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Stockbot
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select 
              value={currentModel} 
              onValueChange={setCurrentModel}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="text-xs">
                    {model.name} ({model.providerName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline" 
              size="icon"
              onClick={() => clearChat()}
              title="Clear chat"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 px-4 flex-grow overflow-hidden">
        <StockbotMessageList messages={messages} />
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
      
      {/* Settings Dialog (Future implementation) */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Stockbot Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Settings content would go here */}
            <p className="text-muted-foreground">Configure Stockbot behavior and API connections</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
