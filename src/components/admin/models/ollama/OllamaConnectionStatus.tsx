
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useOllamaDockerConnect";
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
            <p className="mt-2 text-sm">
              Make sure Ollama is running in the Docker container and the address is correct.
            </p>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
