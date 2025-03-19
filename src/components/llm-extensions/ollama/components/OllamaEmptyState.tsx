
import React from 'react';
import { AlertTriangle, Settings, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OllamaEmptyStateProps {
  isConnected: boolean;
  connectionError: string | null;
  toggleSettings: () => void;
  toggleConnectionInfo: () => void;
}

export function OllamaEmptyState({
  isConnected,
  connectionError,
  toggleSettings,
  toggleConnectionInfo
}: OllamaEmptyStateProps) {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isCorsError = connectionError?.includes('CORS') || 
                     connectionError?.includes('Failed to fetch') || 
                     connectionError?.includes('cross-origin');
  
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-4 text-center">
      {isConnected ? (
        <>
          <div className="rounded-full bg-green-100 p-3">
            <Server className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-medium">Connected to Ollama</h3>
          <p className="text-muted-foreground max-w-md">
            Your Ollama instance doesn't have any models installed or no messages have been sent yet.
          </p>
          <Button onClick={toggleSettings}>
            Configure Models
          </Button>
        </>
      ) : (
        <>
          <div className="rounded-full bg-amber-100 p-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-medium">Not Connected to Ollama</h3>
          
          {connectionError && (
            <Alert variant={isCorsError ? "destructive" : "warning"} className="max-w-md">
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription className="text-left text-sm">
                {isCorsError ? (
                  <div className="space-y-3">
                    <p>CORS Error: Browser security is blocking the connection to your local Ollama server.</p>
                    
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs mt-2">
                      <p className="font-medium">To fix this, start Ollama with:</p>
                      <pre className="bg-black text-white p-2 rounded my-1 overflow-x-auto">
                        {`OLLAMA_ORIGINS=${currentOrigin} ollama serve`}
                      </pre>
                    </div>
                  </div>
                ) : (
                  connectionError
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={toggleConnectionInfo}>
              Connection Details
            </Button>
            <Button onClick={toggleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
