
import React, { forwardRef, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockbotMessage } from "../hooks/stockbot/types";
import { TradingViewChart, MarketHeatmap, StockNews } from "./stockbot/TradingViewWidgets";

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

    const renderMessageContent = (content: string) => {
      // Check for trading view widgets in the message
      if (content.includes('[TradingView Chart Widget for')) {
        const match = content.match(/\[TradingView Chart Widget for (\w+) with timeframe (\w+)\]/);
        if (match && match[1] && match[2]) {
          const symbol = match[1];
          const timeframe = match[2];
          return (
            <>
              <div className="mb-2">Here's the chart for {symbol}:</div>
              <TradingViewChart symbol={symbol} timeframe={timeframe} />
            </>
          );
        }
      }
      
      // Check for market heatmap widgets
      if (content.includes('[Market Heatmap for')) {
        const match = content.match(/\[Market Heatmap for (\w+) sectors\]/);
        if (match && match[1]) {
          const sector = match[1];
          return (
            <>
              <div className="mb-2">Here's the market heatmap{sector !== "all" ? ` for the ${sector} sector` : ""}:</div>
              <MarketHeatmap sector={sector} />
            </>
          );
        }
      }
      
      // Check for stock news widgets
      if (content.includes('[Latest news for')) {
        const match = content.match(/\[Latest news for (\w+) \((\d+) items\)\]/);
        if (match && match[1] && match[2]) {
          const symbol = match[1];
          const count = parseInt(match[2], 10);
          return (
            <>
              <div className="mb-2">Here's the latest news for {symbol}:</div>
              <StockNews symbol={symbol} count={count} />
            </>
          );
        }
      }
      
      // Default case: just render the text
      return <div className="whitespace-pre-wrap">{content}</div>;
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
              {renderMessageContent(typeof message.content === 'string' ? message.content : String(message.content))}
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
