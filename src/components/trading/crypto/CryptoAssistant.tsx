
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Trash2, CoinIcon } from "lucide-react";
import { useCryptoAssistant } from "../hooks/useCryptoAssistant";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CryptoAssistant() {
  const { messages, isLoading, error, sendMessage, clearChat } = useCryptoAssistant();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  // Render cryptocurrency chart function
  const renderFunctionCall = (content: string) => {
    const regex = /<function=([a-zA-Z]+)(\{.*?\})><\/function>/g;
    
    if (!regex.test(content)) {
      return content;
    }
    
    return content.replace(regex, (match, funcName, args) => {
      try {
        const parsedArgs = JSON.parse(args);
        
        if (funcName === 'showCryptoChart') {
          return `<div class="bg-black/5 p-3 rounded-md my-2">
            <div class="font-medium text-sm mb-1">📊 Crypto Chart: ${parsedArgs.symbol}</div>
            <div class="text-xs text-muted-foreground">Timeframe: ${parsedArgs.timeframe || '1D'}</div>
            <img src="https://placeholder-api.com/chart/${parsedArgs.symbol.toLowerCase()}/${parsedArgs.timeframe || '1D'}" 
                 alt="${parsedArgs.symbol} chart" class="rounded mt-2 w-full h-40 bg-gray-100" />
          </div>`;
        }
        
        if (funcName === 'getCryptoPrice') {
          return `<div class="bg-black/5 p-3 rounded-md my-2">
            <div class="font-medium text-sm mb-1">💰 Crypto Price: ${parsedArgs.symbol}</div>
            <div class="text-xs text-muted-foreground">Fetching latest price data...</div>
          </div>`;
        }
        
        if (funcName === 'getCryptoNews') {
          return `<div class="bg-black/5 p-3 rounded-md my-2">
            <div class="font-medium text-sm mb-1">📰 Crypto News: ${parsedArgs.symbol}</div>
            <div class="text-xs text-muted-foreground">Showing ${parsedArgs.count || 3} recent news items</div>
          </div>`;
        }
        
        return match;
      } catch (e) {
        console.error('Error parsing function call:', e);
        return match;
      }
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <CoinIcon className="w-5 h-5 mr-2 text-yellow-500" />
          Crypto Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {error && (
          <Alert variant="destructive" className="mx-4 mt-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "flex flex-col max-w-[85%] rounded-lg p-3",
                message.role === "user" 
                  ? "ml-auto bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              <div 
                className="text-sm" 
                dangerouslySetInnerHTML={{ 
                  __html: message.role === "assistant" 
                    ? renderFunctionCall(message.content) 
                    : message.content 
                }} 
              />
              <span className="text-xs opacity-70 mt-1 self-end">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 pt-2 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cryptocurrencies..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={clearChat}
              disabled={isLoading || messages.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
