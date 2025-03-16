
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Server } from "lucide-react";
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
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));

  // Auto-set the default address based on environment
  useEffect(() => {
    if (isGitpod && dockerAddress === 'http://localhost:11434') {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isGitpod 
            ? "Connect to the Ollama container in your Gitpod workspace:"
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
      </div>

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
    </div>
  );
};
