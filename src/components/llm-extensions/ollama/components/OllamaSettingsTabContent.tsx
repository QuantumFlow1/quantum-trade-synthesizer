
import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaSettingsTabContentProps {
  isConnected: boolean;
  isLoadingModels: boolean;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setActiveTab: (tab: string) => void;
  refreshModels: () => void;
  connectionError: string | null;
}

export function OllamaSettingsTabContent({
  isConnected,
  isLoadingModels,
  models,
  selectedModel,
  setSelectedModel,
  setActiveTab,
  refreshModels,
  connectionError
}: OllamaSettingsTabContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Ollama Connection</h3>
        
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm mb-2">
            Ollama is running locally at <code className="bg-background px-1 py-0.5 rounded">http://localhost:11434</code>
          </p>
          <p className="text-xs text-muted-foreground">
            If you're having connection issues, make sure Ollama is running with proper CORS settings:
            <br />
            <code className="bg-background px-1 py-0.5 rounded text-xs">
              OLLAMA_ORIGINS={typeof window !== 'undefined' ? window.location.origin : 'your-website-origin'} ollama serve
            </code>
          </p>
        </div>
      </div>
      
      {connectionError && (
        <div className="p-3 border border-red-200 bg-red-50 rounded-md">
          <p className="text-sm text-red-600 font-medium">Connection Error</p>
          <p className="text-xs text-red-500">{connectionError}</p>
        </div>
      )}
      
      {isConnected && (
        <div className="space-y-4">
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Available Models</h3>
            {isLoadingModels ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading models...</span>
              </div>
            ) : models.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {models.map((model) => (
                  <div 
                    key={model.name} 
                    className="border rounded p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedModel(model.name);
                      setActiveTab("chat");
                    }}
                  >
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(model.size / 1e9).toFixed(1)} GB
                      </div>
                    </div>
                    {selectedModel === model.name && (
                      <Badge variant="outline" className="bg-primary/10">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                <p>No models found. You need to install models in Ollama.</p>
                <p className="mt-2">Run <code className="bg-muted p-1 rounded">ollama pull llama3</code> to install Llama 3.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={refreshModels}
              variant="outline"
              size="sm"
              disabled={isLoadingModels}
            >
              {isLoadingModels ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Models
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
