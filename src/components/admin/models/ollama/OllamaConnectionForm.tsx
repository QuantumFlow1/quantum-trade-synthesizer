
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Laptop } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface OllamaConnectionFormProps {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectToDocker: (address: string) => Promise<boolean | void>;
  currentOrigin: string;
  useServerSideProxy: boolean;
  setUseServerSideProxy: (enabled: boolean) => void;
  autoRetryEnabled?: boolean;
  toggleAutoRetry?: () => void;
  isLocalhost?: boolean;
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
  toggleAutoRetry,
  isLocalhost = false
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
            <Label htmlFor="custom-address">Use custom address</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            {isLocalhost && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <Laptop className="h-3 w-3" />
                Local
              </Badge>
            )}
            
            {toggleAutoRetry && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-retry"
                  checked={autoRetryEnabled}
                  onCheckedChange={toggleAutoRetry}
                />
                <Label htmlFor="auto-retry" className="text-sm">
                  Auto-retry {autoRetryEnabled ? "on" : "off"}
                </Label>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCustom ? (
        <div className="flex space-x-2">
          <Input
            placeholder="Enter a custom Ollama address..."
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            disabled={isConnecting}
          />
          <Button 
            onClick={handleConnect} 
            disabled={!customAddress || isConnecting}
          >
            {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Connect
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
            Connect
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://localhost:11434')}
          disabled={isConnecting}
          className={isLocalhost ? "border-green-200 bg-green-50 hover:bg-green-100 text-green-700" : ""}
        >
          localhost:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://127.0.0.1:11434')}
          disabled={isConnecting}
          className={isLocalhost ? "border-green-200 bg-green-50 hover:bg-green-100 text-green-700" : ""}
        >
          127.0.0.1:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://host.docker.internal:11434')}
          disabled={isConnecting}
        >
          host.docker.internal
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleQuickConnect('http://ollama:11434')}
          disabled={isConnecting}
        >
          ollama:11434
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="server-proxy"
          checked={useServerSideProxy}
          onCheckedChange={setUseServerSideProxy}
        />
        <Label htmlFor="server-proxy">Use server-side proxy</Label>
      </div>
    </div>
  );
};
