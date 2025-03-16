
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Server, RefreshCw, ExternalLink, ShieldAlert, Globe } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useOllamaDockerConnect";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OllamaConnectionFormProps {
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectToDocker: (address: string) => Promise<void>;
  useServerSideProxy?: boolean;
  setUseServerSideProxy?: (use: boolean) => void;
  currentOrigin: string;
}

export const OllamaConnectionForm = ({
  dockerAddress,
  setDockerAddress,
  customAddress,
  setCustomAddress,
  isConnecting,
  connectToDocker,
  useServerSideProxy,
  setUseServerSideProxy,
  currentOrigin
}: OllamaConnectionFormProps) => {
  // Detect if we're in Gitpod or a Lovable preview environment
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  
  const isPreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');
  
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
            Gitpod-omgeving gedetecteerd
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Voor Gitpod kun je verbinding maken met Ollama via de containernaam: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">ollama:11434</code>
          </p>
        </div>
      )}

      <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/20 border-amber-500">
        <ShieldAlert className="h-4 w-4 text-amber-500" />
        <AlertTitle>CORS Aandachtspunt</AlertTitle>
        <AlertDescription className="text-xs">
          <p>Omdat dit een webbrowser is, moeten Ollama CORS-headers correct zijn ingesteld om verbinding te maken.</p>
          <p className="mt-1">Probeer Ollama opnieuw te starten met deze omgevingsvariabele:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
            OLLAMA_ORIGINS={currentOrigin}
          </pre>
          <p className="text-xs mt-1">
            Voorbeeld: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama</code>
          </p>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isGitpod 
            ? "Verbinding maken met de Ollama-container in je Gitpod-werkruimte:"
            : isPreview
              ? "Verbinding maken met je Ollama-instantie met CORS geconfigureerd voor deze oorsprong:"
              : "Verbinding maken met een Ollama-instantie in een Docker-container:"}
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
            Verbinden
          </Button>
        </div>
        
        {isPreview && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            <strong>Lovable Preview:</strong> Je Ollama-instantie moet CORS hebben geconfigureerd 
            om verzoeken te accepteren van: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{currentOrigin}</code>
          </p>
        )}
      </div>

      {/* Container ID quick connect buttons */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Snel verbinden met Docker-container:
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
            Container Naam: ollama
          </Button>
        </div>
      </div>

      {/* Alternative local ports */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Probeer alternatieve localhost-poorten:
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
            Probeer verbinding te maken via je Gitpod werkruimte URL:
          </p>
          <Button
            onClick={handleGitpodWorkspaceConnect}
            disabled={isConnecting || !gitpodWorkspaceUrl}
            variant="secondary"
            className="w-full"
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Verbinden via Gitpod Werkruimte URL
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Hiermee wordt geprobeerd verbinding te maken via je Gitpod-werkruimte-URL met poort 11434 blootgesteld.
            Zorg ervoor dat je <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">OLLAMA_ORIGINS={gitpodWorkspaceUrl}</code> hebt ingesteld in je Ollama-container.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Of probeer een andere verbindingsmethode:
        </p>
        
        <div className="flex gap-2">
          <Input
            value={customAddress}
            onChange={handleCustomAddressChange}
            placeholder={isGitpod ? "localhost:11434 of 172.17.0.1:11434" : "ollama of container-id..."}
            className="flex-grow"
          />
          <Button
            onClick={handleDockerIdConnect}
            disabled={isConnecting || !customAddress}
            variant="outline"
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Alternatief proberen
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            <strong>Probleemoplossing:</strong> Probeer je container opnieuw te starten met:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded break-all">
              docker restart ollama
            </code>
          </span>
        </p>
        <p className="mt-2 flex items-center">
          <Globe className="h-3 w-3 mr-1" />
          <span>
            <strong>CORS instellingen:</strong> Gebruik deze optie bij het starten van Ollama:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded break-all">
              docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
            </code>
          </span>
        </p>
      </div>
    </div>
  );
};
