
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Server } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useOllamaDockerConnect";
import { ollamaApi } from "@/utils/ollamaApiClient";

interface OllamaConnectionStatusProps {
  connectionStatus: ConnectionStatus | null;
}

export const OllamaConnectionStatus = ({ connectionStatus }: OllamaConnectionStatusProps) => {
  if (!connectionStatus) return null;

  // Extract origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';

  return (
    <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
      {connectionStatus.connected ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Connected Successfully</AlertTitle>
          <AlertDescription>
            Connected to Ollama at {ollamaApi.getBaseUrl()}
            {connectionStatus.modelsCount !== undefined && (
              <p className="mt-1">Found {connectionStatus.modelsCount} models</p>
            )}
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            {connectionStatus.error}
            
            {connectionStatus.error?.includes('CORS') || connectionStatus.error?.includes('403 Forbidden') ? (
              <div className="mt-2 text-sm">
                <p className="font-medium">CORS Issue:</p>
                <p>Ollama needs to be configured to allow requests from {currentOrigin}</p>
                <p className="mt-1">Try restarting Ollama with:</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs overflow-x-auto">
                  docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                </pre>
              </div>
            ) : (
              <p className="mt-2 text-sm">
                Make sure Ollama is running in the Docker container and the address is correct.
              </p>
            )}
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
