
import React from "react";
import { LLMModel, LLMProviderType } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface LLMModelSelectorProps {
  selectedProvider: LLMProviderType;
  onProviderChange: (provider: LLMProviderType) => void;
  selectedModel: string | null;
  onModelChange: (model: string) => void;
  models: LLMModel[];
  isLoading: boolean;
}

const providers: { id: LLMProviderType; label: string; icon?: React.ReactNode }[] = [
  { id: "groq", label: "Groq", icon: <Sparkles className="h-4 w-4" /> },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Claude" },
  { id: "ollama", label: "Ollama" },
  { id: "deepseek", label: "DeepSeek" }
];

export function LLMModelSelector({
  selectedProvider,
  onProviderChange,
  selectedModel,
  onModelChange,
  models,
  isLoading
}: LLMModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant={selectedProvider === provider.id ? "default" : "outline"}
            size="sm"
            onClick={() => onProviderChange(provider.id)}
            className="flex items-center gap-1"
          >
            {provider.icon}
            {provider.label}
          </Button>
        ))}
      </div>
      
      <div className="w-full">
        <Select
          value={selectedModel || ""}
          onValueChange={onModelChange}
          disabled={isLoading || models.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              isLoading 
                ? "Loading models..." 
                : models.length === 0 
                  ? "No models available" 
                  : "Select a model"
            } />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading models...</span>
              </div>
            ) : models.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                No models available
              </div>
            ) : (
              models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">
                        {model.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
