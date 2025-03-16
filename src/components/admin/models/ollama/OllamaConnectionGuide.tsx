
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle, Info, Server, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<void>;
}

export const OllamaConnectionGuide = ({ connectToDocker }: OllamaConnectionGuideProps) => {
  // Detect if we're in Gitpod environment or Lovable preview
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  
  const isLovablePreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');
  
  // Get the current origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const gitpodWorkspaceUrl = isGitpod && typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="space-y-4">
      <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm">
          <strong>CORS Issue Detected:</strong> The 403 Forbidden errors indicate that the Ollama server is
          not accepting requests from this application's origin: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{currentOrigin}</code>
        </AlertDescription>
      </Alert>
      
      {isGitpod && (
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Gitpod Environment Detected:</strong> Make sure your Ollama container is running and 
            configured to accept requests from your Gitpod workspace URL: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{gitpodWorkspaceUrl}</code>
          </AlertDescription>
        </Alert>
      )}
      
      {isLovablePreview && (
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            <strong>Lovable Preview Environment:</strong> When connecting from a Lovable preview URL, 
            you need to configure your Ollama server to accept cross-origin requests from this preview URL.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1 text-primary" />
          {isGitpod 
            ? "Gitpod Environment - Connection Guide:" 
            : isLovablePreview 
              ? "Lovable Preview - CORS Configuration Guide:" 
              : "Docker Connection Guide:"}
        </h4>
        
        {isGitpod && (
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>
              <span className="font-medium">Check if your Ollama container is running:</span>
              <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono overflow-x-auto">
                docker ps | grep ollama
              </div>
            </li>
            <li>
              <span className="font-medium">If it's not running, start it with the correct OLLAMA_ORIGINS:</span>
              <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono overflow-x-auto">
                docker run -d --name ollama -e OLLAMA_ORIGINS={gitpodWorkspaceUrl} -p 11434:11434 ollama/ollama
              </div>
            </li>
            <li>
              <span className="font-medium">Or if it's already running, restart with updated settings:</span>
              <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono overflow-x-auto">
                docker stop ollama && docker rm ollama<br/>
                docker run -d --name ollama -e OLLAMA_ORIGINS={gitpodWorkspaceUrl} -p 11434:11434 ollama/ollama
              </div>
            </li>
            <li>
              <span className="font-medium">In Gitpod, try these connection options:</span>
              <ul className="list-disc list-inside pl-5 mt-1 text-xs">
                <li>Container name: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://ollama:11434</code></li>
                <li>Local address: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://localhost:11434</code></li>
                <li>Docker internal IP: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://172.17.0.1:11434</code></li>
              </ul>
            </li>
          </ol>
        )}
        
        {isLovablePreview && (
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>
              <span className="font-medium">Start Ollama with your preview URL in OLLAMA_ORIGINS:</span>
              <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono overflow-x-auto">
                docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
              </div>
            </li>
            <li>
              <span className="font-medium">Make sure your Ollama instance is accessible from the internet if you're running locally</span>
              <p className="text-xs mt-1">
                Consider using a service like ngrok to expose your local Ollama instance, or host it on a public server
              </p>
            </li>
            <li>
              <span className="font-medium">For production use, consider:</span>
              <ul className="list-disc list-inside pl-5 mt-1 text-xs">
                <li>Self-hosting Ollama on a server with proper CORS configuration</li>
                <li>Using a backend proxy service to handle requests to Ollama</li>
                <li>Implementing a serverless function to proxy requests</li>
              </ul>
            </li>
          </ol>
        )}
        
        {!isGitpod && !isLovablePreview && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Docker Container Connection Guide:</h4>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Make sure port 11434 is exposed in your Docker container</li>
              <li>Try these connection formats:
                <ul className="list-disc list-inside pl-5 mt-1 text-xs">
                  <li>Container ID: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8</code></li>
                  <li>Container name: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">ollama</code></li>
                  <li>With port: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8:11434</code></li>
                  <li>Full URL: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://de67d12500e8:11434</code></li>
                  <li>Docker host IP: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://host.docker.internal:11434</code></li>
                </ul>
              </li>
              <li>If using host networking in Docker, try <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">localhost:11434</code></li>
              <li>Check that there are no firewall rules blocking access to the container</li>
            </ol>
          </div>
        )}
      </div>
      
      {isGitpod && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => connectToDocker('http://ollama:11434')}
            className="flex items-center justify-center"
          >
            <Server className="h-4 w-4 mr-2" />
            Try Container Name
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => connectToDocker('http://localhost:11434')}
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Localhost
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => connectToDocker('http://172.17.0.1:11434')}
            className="flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Bridge Network
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              // Open a new tab to view port 11434 in Gitpod
              if (gitpodWorkspaceUrl) {
                window.open(gitpodWorkspaceUrl.replace('https://', 'https://11434-'), '_blank');
              }
            }}
            className="flex items-center justify-center"
          >
            <Play className="h-4 w-4 mr-2" />
            Preview Port 11434
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            <strong>Current CORS Configuration:</strong> Your Ollama container needs to be set up with:{" "}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded break-all">
              OLLAMA_ORIGINS={currentOrigin}
            </code>
          </span>
        </p>
      </div>
    </div>
  );
};
