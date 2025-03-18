
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Server, InfoIcon } from "lucide-react";
import { ConnectionStatus } from "@/hooks/ollama/types";
import { ollamaApi } from "@/utils/ollamaApiClient";

interface OllamaConnectionStatusProps {
  connectionStatus: ConnectionStatus | null;
}

export const OllamaConnectionStatus = ({ connectionStatus }: OllamaConnectionStatusProps) => {
  if (!connectionStatus) return null;

  // Extract origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const isLocalOrigin = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Check if this is likely a CORS error
  const isCorsError = connectionStatus.error?.includes('CORS') || 
                      connectionStatus.error?.includes('Failed to fetch') ||
                      ollamaApi.hasCorsError();

  return (
    <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
      {connectionStatus.connected ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Successfully connected</AlertTitle>
          <AlertDescription>
            Connected to Ollama at {ollamaApi.getBaseUrl()}
            {connectionStatus.modelsCount !== undefined && (
              <p className="mt-1">{connectionStatus.modelsCount} models found</p>
            )}
            {connectionStatus.modelsCount === 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No models found. You need to pull a model to use Ollama.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Pull a model by running:</p>
                  <code className="block">
                    ollama pull llama3
                  </code>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Refresh after pulling to see available models
                  </p>
                </div>
              </div>
            )}
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection failed</AlertTitle>
          <AlertDescription>
            {isCorsError ? (
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                  CORS Error: Browser security is blocking the connection to your local Ollama
                </p>
                <p>{connectionStatus.error}</p>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-2">
                  <p className="font-medium">To fix this CORS issue, start Ollama with:</p>
                  
                  <div className="bg-black text-white p-2 rounded overflow-x-auto">
                    <code>OLLAMA_ORIGINS={currentOrigin} ollama serve</code>
                  </div>
                  
                  <p className="font-medium mt-2">Or using Docker:</p>
                  
                  <div className="bg-black text-white p-2 rounded overflow-x-auto">
                    <code>docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama</code>
                  </div>
                  
                  {!isLocalOrigin && (
                    <p className="text-xs text-amber-500 dark:text-amber-400 mt-2">
                      <strong>Note:</strong> You are accessing this app from a non-local origin ({currentOrigin}). 
                      For a purely local setup, consider running this app on localhost.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p>{connectionStatus.error}</p>
                
                <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <p className="text-xs font-medium">Troubleshooting suggestions:</p>
                  <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                    <li>Make sure Ollama is running on your local machine</li>
                    <li>Try alternative ports like 11435</li>
                    <li>Check if Docker is running and accessible</li>
                    <li>Try restarting Ollama: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ollama serve</code></li>
                  </ul>
                </div>
              </div>
            )}
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
