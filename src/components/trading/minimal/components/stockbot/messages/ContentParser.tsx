
import React from "react";
import { MessageRenderer, extractFunctionCall } from "./MessageRenderer";

export const useContentParser = () => {
  const parseMessageContent = (content: string): React.ReactNode => {
    try {
      // Try to extract a function call from the content
      const functionCall = extractFunctionCall(content);
      
      // If we found a function call, render the appropriate widget
      if (functionCall) {
        return <MessageRenderer 
          functionName={functionCall.functionName} 
          params={functionCall.params} 
        />;
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
