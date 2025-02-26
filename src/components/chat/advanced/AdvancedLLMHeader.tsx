
import { X } from "lucide-react";
import { AdvancedLLMHeaderProps } from "./types";
import { getModelDisplayName } from "./utils";

export default function AdvancedLLMHeader({ selectedModelName, onExit }: AdvancedLLMHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
      <h2 className="text-xl font-semibold">{getModelDisplayName(selectedModelName)} Advanced Interface</h2>
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
