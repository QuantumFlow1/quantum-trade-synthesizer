
import React from "react";
import { MessageRenderer, extractFunctionCall } from "./MessageRenderer";

export const useContentParser = () => {
  const parseMessageContent = (content: string): React.ReactNode => {
    try {
      // Log the content we're trying to parse
      console.log("Parsing message content:", content.substring(0, 100) + (content.length > 100 ? "..." : ""));
      
      // Try to extract a function call from the content
      const functionCall = extractFunctionCall(content);
      
      // If we found a function call, render the appropriate widget
      if (functionCall) {
        console.log("Found function call:", functionCall.functionName, functionCall.params);
        return <MessageRenderer 
          functionName={functionCall.functionName} 
          params={functionCall.params} 
        />;
      }
      
      // Check for warning/notice about simulation mode
      if (content.includes("⚠️ NOTE: This is simulated data")) {
        const parts = content.split("⚠️ NOTE:");
        return (
          <div>
            <div className="whitespace-pre-wrap">{parts[0]}</div>
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
              ⚠️ NOTE: {parts[1]}
            </div>
          </div>
        );
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
