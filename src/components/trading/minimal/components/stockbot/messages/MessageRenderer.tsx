
import React from "react";
import { TradingViewChart, MarketHeatmap, StockNews, SentimentAnalysis } from "../widgets";
import { toast } from "@/hooks/use-toast";

interface MessageRendererProps {
  functionName: string;
  params: any;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ functionName, params }) => {
  console.log(`Rendering function: ${functionName}`, params);
  
  try {
    // Handle crypto symbols by ensuring they have proper format
    if (functionName === "showStockChart") {
      // Format crypto symbols to comply with TradingView format
      let symbol = params.symbol || "BTCUSD";
      const timeframe = params.timeframe || "1D";
      
      // Format crypto symbols for TradingView
      if (symbol.toLowerCase() === "bitcoin" || symbol.toLowerCase() === "btc") {
        symbol = "BTCUSD";
      } else if (symbol.toLowerCase() === "ethereum" || symbol.toLowerCase() === "eth") {
        symbol = "ETHUSD";
      } else if (symbol.toLowerCase() === "dogecoin" || symbol.toLowerCase() === "doge") {
        symbol = "DOGEUSD";
      } else if (symbol.toLowerCase() === "solana" || symbol.toLowerCase() === "sol") {
        symbol = "SOLUSD";
      }
      
      // Add exchange prefix for crypto pairs if needed
      if (/^[A-Za-z]+USD$/.test(symbol) && !symbol.includes(":")) {
        symbol = "BINANCE:" + symbol;
      }
      
      console.log(`Displaying chart for formatted symbol: ${symbol}`);
      
      return (
        <>
          <div className="mb-2">Here's the chart for {params.symbol}:</div>
          <TradingViewChart symbol={symbol} timeframe={timeframe} />
        </>
      );
    } else if (functionName === "getStockNews") {
      const symbol = params.symbol || "market";
      const count = params.count || 5;
      return (
        <>
          <div className="mb-2">Here's the latest news for {symbol}:</div>
          <StockNews symbol={symbol} count={count} />
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
    } else if (functionName === "analyzeSentiment") {
      const symbol = params.symbol || "SPY";
      const timeframe = params.timeframe || "1D";
      return (
        <>
          <div className="mb-2">Here's the sentiment analysis for {symbol}:</div>
          <SentimentAnalysis symbol={symbol} timeframe={timeframe} />
        </>
      );
    }
    
    // If no match, return fallback content
    return <div className="whitespace-pre-wrap">Unsupported function: {functionName}</div>;
  } catch (error) {
    console.error("Error rendering function:", error);
    toast({
      title: "Widget Error",
      description: `Failed to render ${functionName} widget`,
      variant: "destructive"
    });
    return <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
      Error rendering {functionName} widget. Please try again.
    </div>;
  }
};

// Improved function to extract function calls from content with better error handling
export const extractFunctionCall = (content: string): { functionName: string; params: any } | null => {
  try {
    console.log("Extracting function call from:", content.substring(0, 100) + (content.length > 100 ? "..." : ""));
    
    // First format: <function=name{"param":"value"}>
    const functionRegex = /<function=(\w+)(\{.*?\})>(?:<\/function>)?/;
    const functionMatch = content.match(functionRegex);
    
    if (functionMatch) {
      const functionName = functionMatch[1];
      const paramsString = functionMatch[2];
      
      try {
        const params = JSON.parse(paramsString);
        console.log(`Parsed function ${functionName} with params:`, params);
        return { functionName, params };
      } catch (e) {
        console.error("Failed to parse function parameters:", e);
      }
    }
    
    // Second format: function=name{"param":"value"}
    const rawFunctionRegex = /function=(\w+)(\{.*?\})/;
    const rawFunctionMatch = content.match(rawFunctionRegex);
    
    if (rawFunctionMatch) {
      const functionName = rawFunctionMatch[1];
      const paramsString = rawFunctionMatch[2];
      
      try {
        const params = JSON.parse(paramsString);
        console.log(`Parsed raw function ${functionName} with params:`, params);
        return { functionName, params };
      } catch (e) {
        console.error("Failed to parse raw function parameters:", e);
      }
    }
    
    // Third format: function at the beginning of content
    if (content.startsWith('<function=') && content.includes('>')) {
      const rawFunction = content.split('>')[0] + '>';
      const funcMatch = rawFunction.match(/<function=(\w+)(\{.*?\})>/);
      
      if (funcMatch) {
        const functionName = funcMatch[1];
        try {
          const params = JSON.parse(funcMatch[2]);
          console.log(`Parsed raw function ${functionName} with params:`, params);
          return { functionName, params };
        } catch (e) {
          console.error("Failed to parse raw function:", e);
        }
      }
    }
    
    // Check for Bitcoin/crypto mentions specifically
    if (/bitcoin|btc|crypto/i.test(content)) {
      if (/price|chart|trend|performance|graph/i.test(content)) {
        console.log("Detected Bitcoin chart request");
        return { 
          functionName: "showStockChart", 
          params: {
            symbol: "BTCUSD",
            timeframe: "1D"
          }
        };
      }
    }
    
    // Fourth format: structured for TradingView
    const tradViewMatch = content.match(/\[TradingView Chart Widget for (\w+) with timeframe (\w+)\]/);
    if (tradViewMatch) {
      return { 
        functionName: "showStockChart", 
        params: {
          symbol: tradViewMatch[1],
          timeframe: tradViewMatch[2]
        }
      };
    }
    
    // Fifth format: structured for Heatmap
    const heatmapMatch = content.match(/\[Market Heatmap for (\w+) sectors?\]/);
    if (heatmapMatch) {
      return { 
        functionName: "showMarketHeatmap", 
        params: {
          sector: heatmapMatch[1].toLowerCase() === "all" ? "all" : heatmapMatch[1]
        }
      };
    }
    
    // Sixth format: structured for News
    const newsMatch = content.match(/\[Latest news for (\w+) \((\d+) items?\)\]/);
    if (newsMatch) {
      return { 
        functionName: "getStockNews", 
        params: {
          symbol: newsMatch[1],
          count: parseInt(newsMatch[2], 10)
        }
      };
    }
    
    // Seventh format: structured for Sentiment
    const sentimentMatch = content.match(/\[Sentiment Analysis for (\w+)\]/);
    if (sentimentMatch) {
      return { 
        functionName: "analyzeSentiment", 
        params: {
          symbol: sentimentMatch[1]
        }
      };
    }
    
    // Eighth format: general mentions of charts
    if (content.includes("chart for") && content.includes("NVIDIA") || content.includes("NVDA")) {
      return {
        functionName: "showStockChart",
        params: {
          symbol: "NVDA",
          timeframe: "1M"
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting function call:", error);
    return null;
  }
};
