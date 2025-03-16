
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
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  const isLovablePreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');

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
            {connectionStatus.modelsCount === 0 && (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                No models found. You may need to pull a model by running: <br/>
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded mt-1 text-xs block">
                  docker exec -it ollama ollama pull llama3
                </code>
              </p>
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
                  {isLovablePreview 
                    ? `docker run -e OLLAMA_ORIGINS=${currentOrigin} -p 11434:11434 ollama/ollama`
                    : isGitpod 
                      ? `docker run -e OLLAMA_ORIGINS=${currentOrigin} -p 11434:11434 ollama/ollama`
                      : `docker run -e OLLAMA_ORIGINS=${currentOrigin} -p 11434:11434 ollama/ollama`
                  }
                </pre>
                {isLovablePreview && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <strong>Lovable Preview:</strong> When connecting from a preview URL, you'll need to 
                    make sure your Ollama instance is publicly accessible and configured with the preview URL 
                    in OLLAMA_ORIGINS. Consider using a backend proxy or serverless function for production use.
                  </p>
                )}
                {isGitpod && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <strong>Gitpod Tip:</strong> In Gitpod, make sure you've started the container and try connecting 
                    with "ollama:11434" or "localhost:11434" first.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm">
                Make sure Ollama is running in the Docker container and the address is correct.
                {isGitpod && " In Gitpod, double check that your Ollama container is running with 'docker ps'."}
              </p>
            )}
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
