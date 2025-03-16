
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Server, AlertTriangle, CheckCircle } from "lucide-react";
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

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    try {
      // Update the address in the API client
      ollamaApi.setBaseUrl(address);
      
      // Test the connection
      const result = await testOllamaConnection();
      
      if (result.success) {
        // Save to localStorage if successful
        localStorage.setItem('ollamaHost', address);
        localStorage.setItem('ollamaDockerAddress', address);
        
        setConnectionStatus({
          connected: true,
          modelsCount: result.models?.length || 0
        });
        
        toast({
          title: "Connected to Ollama Docker",
          description: `Successfully connected to ${address}`,
          variant: "default",
        });
      } else {
        setConnectionStatus({
          connected: false,
          error: result.message
        });
        
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setConnectionStatus({
        connected: false,
        error: errorMessage
      });
      
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
    // Format Docker container ID into a proper URL
    const formattedAddress = `http://${customAddress.trim()}:11434`;
    setDockerAddress(formattedAddress);
    connectToDocker(formattedAddress);
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
            Connect to an Ollama instance running in a Docker container:
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
            Or connect using Docker container ID:
          </p>
          
          <div className="flex gap-2">
            <Input
              value={customAddress}
              onChange={handleCustomAddressChange}
              placeholder="de67d12500e8..."
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
                  Connected to Ollama at {dockerAddress}
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

        <div className="text-sm text-muted-foreground mt-4">
          <p className="font-medium">Tips:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>For Docker containers, make sure port 11434 is exposed</li>
            <li>You can use Docker container ID or name as the host</li>
            <li>Format: http://container-id:11434 or http://container-name:11434</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
