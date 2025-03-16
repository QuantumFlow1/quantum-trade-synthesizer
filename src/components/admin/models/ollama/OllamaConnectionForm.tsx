
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
          Connect to an Ollama instance running in a Docker container using the full address:
        </p>
        
        <div className="flex gap-2">
          <Input
            value={dockerAddress}
            onChange={(e) => setDockerAddress(e.target.value)}
            placeholder="http://localhost:11434"
            className="flex-grow"
          />
          <Button
            onClick={handlePreconfiguredConnect}
            disabled={isConnecting}
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Connect
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Or connect using Docker container ID or name:
        </p>
        
        <div className="flex gap-2">
          <Input
            value={customAddress}
            onChange={handleCustomAddressChange}
            placeholder="ollama or de67d12500e8..."
            className="flex-grow"
          />
          <Button
            onClick={handleDockerIdConnect}
            disabled={isConnecting || !customAddress}
            variant="outline"
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Connect to Container
          </Button>
        </div>
      </div>
    </div>
  );
};
