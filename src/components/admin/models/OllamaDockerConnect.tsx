
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Server, AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { ollamaApi, testOllamaConnection } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";

export const OllamaDockerConnect = () => {
  const [dockerAddress, setDockerAddress] = useState<string>(
    localStorage.getItem('ollamaDockerAddress') || 'http://localhost:11434'
  );
  const [customAddress, setCustomAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    error?: string;
    modelsCount?: number;
  } | null>(null);

  useEffect(() => {
    // Check if there's a connection status in localStorage
    const savedConnection = localStorage.getItem('ollamaConnectionStatus');
    if (savedConnection) {
      try {
        const parsedStatus = JSON.parse(savedConnection);
        setConnectionStatus(parsedStatus);
      } catch (e) {
        console.error('Error parsing saved connection status:', e);
      }
    }
  }, []);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    try {
      console.log(`Attempting to connect to Ollama at: ${address}`);
      
      // Update the address in the API client (this method handles normalization)
      ollamaApi.setBaseUrl(address);
      
      // Get the normalized URL for displaying to the user
      const formattedAddress = ollamaApi.getBaseUrl();
      console.log(`Formatted address: ${formattedAddress}`);
      
      // Test the connection
      const result = await testOllamaConnection();
      console.log('Connection test result:', result);
      
      if (result.success) {
        // Save to localStorage if successful
        localStorage.setItem('ollamaHost', formattedAddress);
        localStorage.setItem('ollamaDockerAddress', formattedAddress);
        
        const newStatus = {
          connected: true,
          modelsCount: result.models?.length || 0
        };
        
        setConnectionStatus(newStatus);
        localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
        
        toast({
          title: "Connected to Ollama Docker",
          description: `Successfully connected to ${formattedAddress}`,
          variant: "default",
        });
      } else {
        const newStatus = {
          connected: false,
          error: result.message
        };
        
        setConnectionStatus(newStatus);
        localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
        
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Docker connection error:', errorMessage);
      
      const newStatus = {
        connected: false,
        error: errorMessage
      };
      
      setConnectionStatus(newStatus);
      localStorage.setItem('ollamaConnectionStatus', JSON.stringify(newStatus));
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 text-primary mr-2" />
          Ollama Docker Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {connectionStatus && (
          <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
            {connectionStatus.connected ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Connected Successfully</AlertTitle>
                <AlertDescription>
                  Connected to Ollama{dockerAddress && ` at ${ollamaApi.getBaseUrl()}`}
                  {connectionStatus.modelsCount !== undefined && (
                    <p className="mt-1">Found {connectionStatus.modelsCount} models</p>
                  )}
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  {connectionStatus.error}
                  <p className="mt-2 text-sm">
                    Make sure Ollama is running in the Docker container and the address is correct.
                  </p>
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mt-2">
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
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectToDocker('de67d12500e8')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Container ID
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectToDocker('ollama')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Container Name
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectToDocker('host.docker.internal:11434')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try host.docker.internal
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => connectToDocker('172.17.0.1:11434')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Docker Bridge IP
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" /> 
              Tip: For Docker Desktop, make sure port 11434 is properly published in your container settings.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
