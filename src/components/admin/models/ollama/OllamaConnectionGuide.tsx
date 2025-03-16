
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle, Info, Server, Play, Laptop } from "lucide-react";
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
  
  // Check if we're running locally
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const handleQuickConnection = (address: string) => {
    connectToDocker(address);
  };

  return (
    <div className="space-y-4">
      {isLovablePreview && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-sm">
            <strong>Preview URL Connection Issue:</strong> When running from a Lovable preview URL 
            (<code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{currentOrigin}</code>), 
            you cannot connect directly to a local Ollama instance due to browser security restrictions.
          </AlertDescription>
        </Alert>
      )}
      
      {isLocalhost && (
        <Alert variant="default" className="bg-green-50 dark:bg-green-950/20">
          <Info className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            <strong>Local Development Detected:</strong> You're running in a local environment, which is ideal for connecting to Ollama.
            Try clicking one of the quick connection buttons below to connect to your local Ollama instance.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Laptop className="h-4 w-4 mr-1 text-primary" />
          Local Development Setup
        </h4>
        
        <div className="space-y-3">
          <div className="mb-3">
            <p className="text-sm">Quick connect to local Ollama:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickConnection('http://localhost:11434')}
                className="flex items-center"
              >
                <Play className="h-3 w-3 mr-1 text-green-500" />
                localhost:11434
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickConnection('http://127.0.0.1:11434')}
                className="flex items-center"
              >
                <Play className="h-3 w-3 mr-1 text-green-500" />
                127.0.0.1:11434
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickConnection('http://host.docker.internal:11434')}
                className="flex items-center"
              >
                <Server className="h-3 w-3 mr-1 text-blue-500" />
                host.docker.internal
              </Button>
            </div>
          </div>
          
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>
              <span className="font-medium">Install Ollama locally</span>
              <p className="text-xs mt-1 ml-5">
                Download from <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">https://ollama.com/download</a> and follow the installation instructions
              </p>
            </li>
            <li>
              <span className="font-medium">Start Ollama</span>
              <p className="text-xs mt-1 ml-5">
                Run <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">ollama serve</code> in your terminal to start the Ollama server
              </p>
            </li>
            <li>
              <span className="font-medium">Pull a model</span>
              <p className="text-xs mt-1 ml-5">
                Run <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">ollama pull llama3</code> or another model of your choice
              </p>
            </li>
            <li>
              <span className="font-medium">Connect from this app</span>
              <p className="text-xs mt-1 ml-5">
                Use the connection form above to connect to <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://localhost:11434</code>
              </p>
            </li>
          </ol>

          {!isLocalhost && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded text-sm">
              <p className="flex items-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <strong>Note:</strong> You're not currently running on localhost.
              </p>
              <p className="mt-1 text-xs">
                For the best experience with Ollama, run this application locally using <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">npm run dev</code> or <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">bun run dev</code>.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            <strong>CORS Configuration:</strong> If needed, your Ollama container can be run with{" "}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded break-all">
              OLLAMA_ORIGINS={currentOrigin}
            </code>
          </span>
        </p>
        
        {isLocalhost && (
          <p className="mt-2 text-green-600 dark:text-green-400">
            <strong>Local Development:</strong> When running both your app and Ollama locally, you should have no CORS issues.
          </p>
        )}
      </div>
    </div>
  );
};
