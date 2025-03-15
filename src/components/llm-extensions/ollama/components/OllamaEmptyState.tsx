
import React from 'react';
import { AlertTriangle, Server } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OllamaEmptyStateProps {
  isConnected: boolean;
  connectionError: string | null;
  onSettingsClick: () => void;
}

export function OllamaEmptyState({ isConnected, connectionError, onSettingsClick }: OllamaEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 text-center">
      <Server className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Connect to Ollama</h3>
      
      {!isConnected && (
        <>
          <p className="text-muted-foreground max-w-md">
            To use Ollama, you need to connect to a running Ollama instance.
          </p>
          
          {connectionError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                {connectionError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-2">
            <p className="text-sm mb-2">Make sure Ollama is running on your machine:</p>
            <code className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm block">
              ollama serve
            </code>
          </div>
          
          <Button onClick={onSettingsClick} className="mt-4">
            Configure Connection
          </Button>
        </>
      )}
      
      {isConnected && (
        <>
          <p className="text-muted-foreground">
            Connected to Ollama successfully, but no models are currently available.
          </p>
          <Button onClick={onSettingsClick} className="mt-4">
            Check Model Settings
          </Button>
        </>
      )}
    </div>
  );
}
