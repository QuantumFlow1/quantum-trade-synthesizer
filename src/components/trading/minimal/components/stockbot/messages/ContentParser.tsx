
import React from "react";
import { MessageRenderer, extractFunctionCall } from "./MessageRenderer";
import { toast } from "@/hooks/use-toast";

export const useContentParser = () => {
  const parseMessageContent = (content: string): React.ReactNode => {
    try {
      // Log the content we're trying to parse
      console.log("Parsing message content:", content.substring(0, 100) + (content.length > 100 ? "..." : ""));
      
      // Check for error messages
      if (content.includes("I'm sorry, I encountered an error") || 
          content.includes("Error processing your request")) {
        return (
          <div className="space-y-2">
            <div className="whitespace-pre-wrap text-amber-700">{content}</div>
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs">
              ⚠️ There was an issue processing your request. This might be due to:
              <ul className="list-disc pl-4 mt-1">
                <li>API connection issues</li>
                <li>Data availability for the requested asset</li>
                <li>The function call format not being properly recognized</li>
              </ul>
              <p className="mt-1">Try asking in a different way or about a different asset.</p>
            </div>
          </div>
        );
      }
      
      // Check for common cryptocurrency keywords
      const hasCryptoKeywords = /bitcoin|btc|ethereum|eth|crypto|cryptocurrency/i.test(content);
      const hasChartKeywords = /chart|price|graph|trend/i.test(content);
      
      if (hasCryptoKeywords && hasChartKeywords && content.length < 200) {
        // If it's a short message about crypto charts, try to generate a chart widget
        const symbol = content.includes("bitcoin") || content.includes("BTC") ? "BTCUSD" : 
                      content.includes("ethereum") || content.includes("ETH") ? "ETHUSD" : "BTCUSD";
        
        console.log(`Auto-generating chart for detected crypto: ${symbol}`);
        
        return (
          <div>
            <div className="whitespace-pre-wrap mb-2">{content}</div>
            <MessageRenderer 
              functionName="showStockChart" 
              params={{ symbol, timeframe: "1D" }} 
            />
          </div>
        );
      }
      
      // Try to extract a function call from the content
      const functionCall = extractFunctionCall(content);
      
      // If we found a function call, render the appropriate widget
      if (functionCall) {
        console.log("Found function call:", functionCall.functionName, functionCall.params);
        return (
          <div>
            <div className="whitespace-pre-wrap mb-2">
              {content.replace(/<function=[\s\S]*?>[\s\S]*?<\/function>/, "")}
            </div>
            <MessageRenderer 
              functionName={functionCall.functionName} 
              params={functionCall.params} 
            />
          </div>
        );
      }
      
      // Check for warning/notice about simulation mode or fictional data
      if (content.includes("⚠️ NOTE:") || 
          content.includes("Please note that these headlines are fictional") ||
          content.includes("This is simulated data") ||
          content.includes("fictional and for demonstration purposes")) {
        
        let mainContent = content;
        let noticeContent = "";
        
        if (content.includes("⚠️ NOTE:")) {
          const parts = content.split("⚠️ NOTE:");
          mainContent = parts[0];
          noticeContent = parts[1];
        } else if (content.includes("Please note that these headlines are fictional")) {
          const index = content.indexOf("Please note that these headlines are fictional");
          mainContent = content.substring(0, index);
          noticeContent = content.substring(index);
        } else if (content.includes("This is simulated data")) {
          const index = content.indexOf("This is simulated data");
          mainContent = content.substring(0, index);
          noticeContent = "This is simulated data for demonstration purposes only.";
        } else if (content.includes("fictional and for demonstration purposes")) {
          const index = content.indexOf("fictional and for demonstration purposes");
          const startIndex = Math.max(0, content.lastIndexOf(".", index) + 1);
          mainContent = content.substring(0, startIndex);
          noticeContent = content.substring(startIndex);
        }
        
        return (
          <div>
            <div className="whitespace-pre-wrap">{mainContent}</div>
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
              ⚠️ NOTE: {noticeContent || "This is simulated data for demonstration purposes only."}
            </div>
          </div>
        );
      }
      
      // Default case: just render the text
      return <div className="whitespace-pre-wrap">{content}</div>;
    } catch (error) {
      console.error("Error rendering message content:", error, "Original content:", content);
      toast({
        title: "Error displaying message",
        description: "There was a problem rendering the message content",
        variant: "destructive"
      });
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
  };

  return { parseMessageContent };
};
