import React, { forwardRef, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockbotMessage } from "../hooks/stockbot/types";
import { TradingViewChart, MarketHeatmap, StockNews } from "./stockbot/widgets";

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
      try {
        // Handle function format: <function=name{"param":"value"}>
        const functionRegex = /<function=(\w+)(\{.*?\})>(?:<\/function>)?/;
        const functionMatch = content.match(functionRegex);
        
        if (functionMatch) {
          const functionName = functionMatch[1];
          const paramsString = functionMatch[2];
          let params = {};
          
          try {
            params = JSON.parse(paramsString);
          } catch (e) {
            console.error("Failed to parse function parameters:", e, "Original content:", content);
          }
          
          return renderFunctionWidget(functionName, params);
        }
        
        // Check for alternative function format without quotes: <function=name{param:value}>
        const altFunctionRegex = /<function=(\w+)\{([^}]+)\}>/;
        const altMatch = content.match(altFunctionRegex);
        
        if (altMatch) {
          const functionName = altMatch[1];
          // Convert to proper JSON format
          const paramsText = altMatch[2].replace(/(\w+):/g, '"$1":');
          const paramsString = `{${paramsText}}`;
          
          try {
            const params = JSON.parse(paramsString);
            return renderFunctionWidget(functionName, params);
          } catch (e) {
            console.error("Failed to parse alternative function parameters:", e, "Original content:", content);
          }
        }
        
        // Check for function format without tags, directly in content
        if (content.startsWith('<function=') && content.includes('>')) {
          const rawFunction = content.split('>')[0] + '>';
          const funcMatch = rawFunction.match(/<function=(\w+)(\{.*?\})>/);
          
          if (funcMatch) {
            const functionName = funcMatch[1];
            let params = {};
            
            try {
              params = JSON.parse(funcMatch[2]);
              return renderFunctionWidget(functionName, params);
            } catch (e) {
              console.error("Failed to parse raw function:", e, "Original content:", content);
            }
          }
        }
        
        // Check for traditional bracket format
        const tradViewMatch = content.match(/\[TradingView Chart Widget for (\w+) with timeframe (\w+)\]/);
        if (tradViewMatch) {
          return renderFunctionWidget("showStockChart", {
            symbol: tradViewMatch[1],
            timeframe: tradViewMatch[2]
          });
        }
        
        const heatmapMatch = content.match(/\[Market Heatmap for (\w+) sectors\]/);
        if (heatmapMatch) {
          return renderFunctionWidget("showMarketHeatmap", {
            sector: heatmapMatch[1]
          });
        }
        
        const newsMatch = content.match(/\[Latest news for (\w+) \((\d+) items\)\]/);
        if (newsMatch) {
          return renderFunctionWidget("getStockNews", {
            symbol: newsMatch[1],
            count: parseInt(newsMatch[2], 10)
          });
        }
        
        // Default case: just render the text
        return <div className="whitespace-pre-wrap">{content}</div>;
      } catch (error) {
        console.error("Error rendering message content:", error, "Original content:", content);
        return <div className="whitespace-pre-wrap">{content}</div>;
      }
    };
    
    // Helper function to render the appropriate widget based on function name
    const renderFunctionWidget = (functionName: string, params: any) => {
      if (functionName === "getStockNews") {
        const symbol = params.symbol || "market";
        const count = params.count || 5;
        return (
          <>
            <div className="mb-2">Here's the latest news for {symbol}:</div>
            <StockNews symbol={symbol} count={count} />
          </>
        );
      } else if (functionName === "showStockChart") {
        const symbol = params.symbol || "SPY";
        const timeframe = params.timeframe || "1M";
        return (
          <>
            <div className="mb-2">Here's the chart for {symbol}:</div>
            <TradingViewChart symbol={symbol} timeframe={timeframe} />
          </>
        );
      } else if (functionName === "showMarketHeatmap") {
        const sector = params.sector || "all";
        return (
          <>
            <div className="mb-2">Here's the market heatmap{sector !== "all" ? ` for the ${sector} sector` : ""}:</div>
            <MarketHeatmap sector={sector} />
          </>
        );
      }
      
      // If no match, return the original content
      return <div className="whitespace-pre-wrap">Unsupported function: {functionName}</div>;
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
