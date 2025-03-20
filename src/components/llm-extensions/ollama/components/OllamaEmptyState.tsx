
import React from 'react';
import { Settings, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaEmptyStateProps {
  isConnected: boolean;
  connectionError: string | null;
  toggleSettings: () => void;
  toggleConnectionInfo: () => void;
  models?: OllamaModel[];
  isLoadingModels?: boolean;
}

export function OllamaEmptyState({
  isConnected,
  connectionError,
  toggleSettings,
  toggleConnectionInfo,
  models,
  isLoadingModels
}: OllamaEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Server className="h-12 w-12 text-muted-foreground mb-4" />
      
      <h3 className="text-xl font-semibold mb-2">
        {isConnected ? 'Select a model to start chat' : 'Simulation Mode Active'}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {isConnected
          ? models && models.length > 0 
            ? "Choose an Ollama model from the dropdown above to start chatting" 
            : "No models found. You'll need to pull some models first."
          : "Currently using simulation mode with pre-generated responses."}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={toggleSettings} variant="outline" className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        
        {!isConnected && (
          <Button onClick={toggleConnectionInfo} variant="default" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Information
          </Button>
        )}
      </div>
      
      {!isConnected && (
        <div className="mt-6 w-full max-w-lg">
          <Alert>
            <AlertTitle>Using simulation mode</AlertTitle>
            <AlertDescription>
              <p>AI responses are currently simulated with pre-generated text.</p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
