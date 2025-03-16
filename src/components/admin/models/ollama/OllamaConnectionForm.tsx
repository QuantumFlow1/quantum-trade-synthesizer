
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OllamaConnectionFormProps {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectToDocker: (address: string) => void;
  currentOrigin: string;
  useServerSideProxy: boolean;
  setUseServerSideProxy: (enabled: boolean) => void;
  autoRetryEnabled?: boolean;
  toggleAutoRetry?: () => void;
}

export const OllamaConnectionForm = ({
  dockerAddress,
  setDockerAddress,
  customAddress,
  setCustomAddress,
  isConnecting,
  connectToDocker,
  currentOrigin,
  useServerSideProxy,
  setUseServerSideProxy,
  autoRetryEnabled = false,
  toggleAutoRetry
}: OllamaConnectionFormProps) => {
  const [isCustom, setIsCustom] = useState(false);
  
  const handleConnect = () => {
    if (isCustom && customAddress) {
      connectToDocker(customAddress);
    } else {
      connectToDocker(dockerAddress);
    }
  };

  const handleQuickConnect = (address: string) => {
    connectToDocker(address);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="custom-address"
              checked={isCustom}
              onCheckedChange={setIsCustom}
            />
            <Label htmlFor="custom-address">Aangepast adres gebruiken</Label>
          </div>
          
          {toggleAutoRetry && (
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-retry"
                checked={autoRetryEnabled}
                onCheckedChange={toggleAutoRetry}
              />
              <Label htmlFor="auto-retry" className="text-sm">
                Auto-retry {autoRetryEnabled ? "aan" : "uit"}
              </Label>
            </div>
          )}
        </div>
      </div>

      {isCustom ? (
        <div className="flex space-x-2">
          <Input
            placeholder="Voer een aangepast Ollama-adres in..."
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            disabled={isConnecting}
          />
          <Button 
            onClick={handleConnect} 
            disabled={!customAddress || isConnecting}
          >
            {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verbinden
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            value={dockerAddress}
            onChange={(e) => setDockerAddress(e.target.value)}
            disabled={isConnecting}
          />
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verbinden
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://localhost:11434')}
          disabled={isConnecting}
        >
          localhost:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://ollama:11434')}
          disabled={isConnecting}
        >
          ollama:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://localhost:11435')}
          disabled={isConnecting}
        >
          localhost:11435
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://localhost:37321')}
          disabled={isConnecting}
        >
          localhost:37321
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="server-proxy"
          checked={useServerSideProxy}
          onCheckedChange={setUseServerSideProxy}
        />
        <Label htmlFor="server-proxy">Server-side proxy gebruiken</Label>
      </div>
    </div>
  );
};
