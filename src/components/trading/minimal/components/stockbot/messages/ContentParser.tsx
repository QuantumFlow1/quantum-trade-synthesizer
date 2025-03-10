
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
      
      // Check for warning/notice about simulation mode or fictional data
      if (content.includes("⚠️ NOTE:") || content.includes("Please note that these headlines are fictional")) {
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
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
  };

  return { parseMessageContent };
};
