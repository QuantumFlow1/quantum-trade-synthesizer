
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<void>;
}

export const OllamaConnectionGuide = ({ connectToDocker }: OllamaConnectionGuideProps) => {
  return (
    <div className="space-y-4">
      <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm">
          <strong>CORS Issue Detected:</strong> The 403 Forbidden errors in the logs indicate that the Ollama server is
          not accepting requests from this application's origin.
        </AlertDescription>
      </Alert>
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1 text-primary" />
          How to Fix CORS Issues:
        </h4>
        <ol className="list-decimal list-inside text-sm space-y-2">
          <li>
            <span className="font-medium">Add your application's origin to Ollama's allowed origins list:</span>
            <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono">
              docker run -e OLLAMA_ORIGINS=http://localhost:5173,http://localhost:3000,{window.location.origin} -p 11434:11434 ollama/ollama
            </div>
            Replace <code className="bg-gray-300 dark:bg-gray-700 px-1 rounded">localhost:5173</code> with your actual development server port
          </li>
          <li>
            <span className="font-medium">Use host networking mode (simplest option):</span>
            <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs font-mono">
              docker run --network host ollama/ollama
            </div>
          </li>
          <li>
            <span className="font-medium">Use a CORS proxy for development (not recommended for production)</span>
          </li>
        </ol>
      </div>
      
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
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('172.17.0.1:11434')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Docker Bridge IP
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('host.docker.internal:11434')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try host.docker.internal
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('ollama')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Container Name
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => connectToDocker('localhost:11434')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Localhost
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            Your Ollama server is configured to only accept requests from: {" "}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
              localhost, 127.0.0.1, 0.0.0.0
            </code>
          </span>
        </p>
      </div>
    </div>
  );
};
