
import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockbotMessage } from "../hooks/stockbot/types";

interface StockbotMessagesProps {
  messages: StockbotMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  hasApiKey: boolean;
  onConfigureApiKey: () => void;
}

export const StockbotMessages = forwardRef<HTMLDivElement, StockbotMessagesProps>(
  ({ messages, isLoading, messagesEndRef, hasApiKey, onConfigureApiKey }, ref) => {
    const formatTimestamp = (timestamp: number | Date) => {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
            <p className="mb-2">Hello! I'm Stockbot, your virtual trading assistant. How can I help you today?</p>
            {!hasApiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2 max-w-md text-sm text-amber-700">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Note: This is a simulated response. For personalized AI-powered analysis, admin API keys are being checked.
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {typeof message.content === 'string' ? message.content : String(message.content)}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-100">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>
    );
  }
);

StockbotMessages.displayName = "StockbotMessages";
