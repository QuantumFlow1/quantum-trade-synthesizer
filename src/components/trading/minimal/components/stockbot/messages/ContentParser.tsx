
import React from "react";
import { MessageRenderer } from "./MessageRenderer";

export const useContentParser = () => {
  const { renderFunctionWidget } = MessageRenderer();

  const parseMessageContent = (content: string): React.ReactNode => {
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

  return { parseMessageContent };
};
