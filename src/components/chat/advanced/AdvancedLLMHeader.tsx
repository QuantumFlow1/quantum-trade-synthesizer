
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { AdvancedLLMHeaderProps } from "./types";
import { getModelDisplayName } from "./utils";

export default function AdvancedLLMHeader({ selectedModelName, onExit }: AdvancedLLMHeaderProps) {
  const modelDisplayName = getModelDisplayName(selectedModelName);
  
  // Update the document title to reflect the selected model
  useEffect(() => {
    // Set timeout to ensure this runs after the component mounts
    const titleTimeout = setTimeout(() => {
      document.title = `${modelDisplayName} Assistant`;
      console.log("Updated document title to:", `${modelDisplayName} Assistant`);
    }, 100);
    
    // Restore original title when component unmounts
    return () => {
      clearTimeout(titleTimeout);
      document.title = "Grok AI Assistant";
    };
  }, [selectedModelName, modelDisplayName]);

  return (
    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
      <h2 className="text-xl font-semibold">{modelDisplayName} Advanced Interface</h2>
      <button 
        onClick={onExit}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Exit"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
