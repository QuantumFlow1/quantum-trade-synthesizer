
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Server, RefreshCw, ExternalLink } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useOllamaDockerConnect";

interface OllamaConnectionFormProps {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectToDocker: (address: string) => Promise<void>;
}

export const OllamaConnectionForm = ({
  dockerAddress,
  setDockerAddress,
  customAddress,
  setCustomAddress,
  isConnecting,
  connectToDocker
}: OllamaConnectionFormProps) => {
  // Detect if we're in Gitpod or a Lovable preview environment
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  
  const isPreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');
  
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const gitpodWorkspaceUrl = isGitpod && typeof window !== 'undefined' ? window.location.origin : '';

  // Auto-set the default address based on environment
  useEffect(() => {
    if (isGitpod && dockerAddress === 'http://localhost:11434') {
      // In Gitpod, default to the container name
      setDockerAddress('http://ollama:11434');
    }
  }, [isGitpod, dockerAddress, setDockerAddress]);

  const handleDockerIdConnect = () => {
    if (!customAddress) return;
    connectToDocker(customAddress);
  };

  const handlePreconfiguredConnect = () => {
    connectToDocker(dockerAddress);
  };

  const handleCustomAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAddress(e.target.value);
  };

  const handleGitpodWorkspaceConnect = () => {
    // Use the Gitpod workspace URL for connection
    if (gitpodWorkspaceUrl) {
      // Assuming the ollama service is exposed on port 11434 in the Gitpod workspace
      const ollamaUrl = gitpodWorkspaceUrl.replace('https://', 'https://11434-');
      connectToDocker(ollamaUrl);
    }
  };

  // Add direct container connection options
  const handleDirectContainerConnect = (containerId: string) => {
    connectToDocker(`http://${containerId}:11434`);
  };

  return (
    <div className="space-y-4">
      {isGitpod && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Gitpod Environment Detected
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            For Gitpod, you can connect to Ollama using the container name: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ollama:11434</code>
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isGitpod 
            ? "Connect to the Ollama container in your Gitpod workspace:"
            : isPreview
              ? "Connect to your Ollama instance with CORS configured for this origin:"
              : "Connect to an Ollama instance running in a Docker container:"}
        </p>
        
        <div className="flex gap-2">
          <Input
            value={dockerAddress}
            onChange={(e) => setDockerAddress(e.target.value)}
            placeholder={isGitpod ? "http://ollama:11434" : "http://localhost:11434"}
            className="flex-grow"
          />
          <Button
            onClick={handlePreconfiguredConnect}
            disabled={isConnecting}
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Server className="h-4 w-4 mr-2" />}
            Connect
          </Button>
        </div>
        
        {isPreview && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            <strong>Lovable Preview:</strong> Your Ollama instance must have CORS configured 
            to accept requests from: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{currentOrigin}</code>
          </p>
        )}
      </div>

      {/* Container ID quick connect buttons */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Quick connect to Docker container:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDirectContainerConnect('de67d12500e8')}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Container ID: de67d12500e8
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDirectContainerConnect('ollama')}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Container Name: ollama
          </Button>
        </div>
      </div>

      {/* Alternative local ports */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Try alternative localhost ports:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => connectToDocker('http://localhost:11435')}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            localhost:11435
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => connectToDocker('http://localhost:37321')}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            localhost:37321
          </Button>
        </div>
      </div>

      {isGitpod && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Try connecting using your Gitpod workspace URL:
          </p>
          <Button
            onClick={handleGitpodWorkspaceConnect}
            disabled={isConnecting || !gitpodWorkspaceUrl}
            variant="secondary"
            className="w-full"
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Connect via Gitpod Workspace URL
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            This will attempt to connect using your Gitpod workspace URL with port 11434 exposed.
            Make sure you've set <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">OLLAMA_ORIGINS={gitpodWorkspaceUrl}</code> in your Ollama container.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Or try a different connection method:
        </p>
        
        <div className="flex gap-2">
          <Input
            value={customAddress}
            onChange={handleCustomAddressChange}
            placeholder={isGitpod ? "localhost:11434 or 172.17.0.1:11434" : "ollama or container-id..."}
            className="flex-grow"
          />
          <Button
            onClick={handleDockerIdConnect}
            disabled={isConnecting || !customAddress}
            variant="outline"
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Try Alternative
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            <strong>Troubleshooting:</strong> Try restarting your container with:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded break-all">
              docker restart ollama
            </code>
          </span>
        </p>
      </div>
    </div>
  );
};
