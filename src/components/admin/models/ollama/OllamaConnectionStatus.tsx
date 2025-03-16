
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Server, InfoIcon } from "lucide-react";
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
              <div className="mt-2 space-y-2">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No models found. You need to pull a model to use Ollama.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Pull a model by running:</p>
                  {isGitpod ? (
                    <code className="block">
                      docker exec -it ollama ollama pull llama3
                    </code>
                  ) : (
                    <code className="block">
                      docker exec -it ollama ollama pull llama3
                    </code>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    After pulling, refresh to see the available models
                  </p>
                </div>
              </div>
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
                
                {isGitpod ? (
                  <div className="mt-2">
                    <p className="font-medium">In Gitpod, try:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                      docker stop ollama && docker rm ollama<br/>
                      docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                    </pre>
                    <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      <strong>Gitpod Tip:</strong> You may need to expose port 11434 in your Gitpod configuration.
                      Check if port 11434 is listed in the Ports tab in the Gitpod UI.
                    </p>
                  </div>
                ) : isLovablePreview ? (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                    docker stop ollama && docker rm ollama<br/>
                    docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                  </pre>
                ) : (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                    docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                  </pre>
                )}
                
                {isLovablePreview && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <strong>Lovable Preview:</strong> When connecting from a preview URL, you'll need to 
                    make sure your Ollama instance is publicly accessible and configured with the preview URL 
                    in OLLAMA_ORIGINS. Consider using a backend proxy or serverless function for production use.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm">
                <p className="font-medium">Connection Error:</p>
                <p>Make sure Ollama is running and the address is correct.</p>
                
                {isGitpod && (
                  <div className="mt-2">
                    <p className="font-medium">In Gitpod, check:</p>
                    <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                      <li>Is the Ollama container running? Run: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">docker ps | grep ollama</code></li>
                      <li>Try connecting to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://ollama:11434</code> or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://172.17.0.1:11434</code></li>
                      <li>Is port 11434 exposed in Gitpod?</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
