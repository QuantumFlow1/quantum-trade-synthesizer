
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ModelId } from "../../types/GrokSettings";

/**
 * Side effects for the Advanced LLM interface
 */
export const useAdvancedLLMEffects = (
  selectedModel: ModelId,
  apiAvailable: boolean | null,
  temperature: number,
  grokSettings: any,
  setGrokSettings: (settings: any) => void
) => {
  // Sync settings with global settings
  useEffect(() => {
    setGrokSettings({
      ...grokSettings,
      selectedModel: selectedModel,
      temperature: temperature
    });
  }, [selectedModel, temperature, grokSettings, setGrokSettings]);
  
  // Check if the selected model is available
  useEffect(() => {
    if (selectedModel === 'grok3' && apiAvailable === false) {
      toast({
        title: "Grok3 API Unavailable",
        description: "The Grok3 API is currently unavailable. Your messages will be processed by an alternative model.",
        variant: "warning",
        duration: 5000,
      });
    }
  }, [selectedModel, apiAvailable]);
};
