
import React from "react";
import { StockbotMessage } from "../hooks/stockbot/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContentParser } from "./stockbot/messages/ContentParser";
import { cn } from "@/lib/utils";
import { Loader2, Bot, UserCircle2 } from "lucide-react";

interface StockbotMessagesProps {
  messages: StockbotMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  hasApiKey?: boolean;
  onConfigureApiKey?: () => void;
  isUsingRealData?: boolean;
}

export const StockbotMessages: React.FC<StockbotMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  hasApiKey = false,
  onConfigureApiKey,
  isUsingRealData = false
}) => {
  const { parseMessageContent } = useContentParser();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center flex-col space-y-2 text-center p-8">
          <Bot className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">Welcome to Stockbot</h3>
          <p className="text-sm text-gray-500 max-w-md">
            Ask me about stocks, market trends, or financial information. I can show you charts, news, and analysis.
          </p>
          {!hasApiKey && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 max-w-md">
              <p className="font-medium mb-1">⚠️ Simulation Mode Active</p>
              <p className="text-xs text-amber-700">
                You're currently using simulated responses. 
                <button 
                  onClick={onConfigureApiKey}
                  className="text-blue-600 hover:underline ml-1"
                >
                  Configure an API key
                </button> 
                for real AI-powered responses.
              </p>
            </div>
          )}
          {isUsingRealData && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800 max-w-md">
              <p className="font-medium mb-1">📊 Real Market Data Enabled</p>
              <p className="text-xs text-blue-700">
                You're using real market data where available.
              </p>
            </div>
          )}
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "flex max-w-[80%] gap-2",
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {message.sender === "user" ? (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <UserCircle2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/bot-avatar.png" alt="Bot" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={cn(
                  "rounded-lg p-3",
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                {parseMessageContent(message.content)}
              </div>
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex max-w-[80%] gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-muted p-3 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
