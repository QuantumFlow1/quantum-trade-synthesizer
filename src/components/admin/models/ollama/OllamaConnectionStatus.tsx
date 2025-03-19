
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Server } from "lucide-react";
import { ConnectionStatus } from "@/hooks/ollama/types";
import { ollamaApi } from "@/utils/ollamaApiClient";

interface OllamaConnectionStatusProps {
  connectionStatus: ConnectionStatus | null;
}

export const OllamaConnectionStatus = ({ connectionStatus }: OllamaConnectionStatusProps) => {
  if (!connectionStatus) return null;

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
            <p>Could not connect to Ollama service</p>
            <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-xs font-medium">Troubleshooting suggestions:</p>
              <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                <li>Make sure Ollama is running on your local machine</li>
                <li>Check if Docker is running and accessible</li>
                <li>Try restarting Ollama service</li>
              </ul>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
