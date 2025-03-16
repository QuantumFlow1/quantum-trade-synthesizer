
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";
import { useOllamaDockerConnect } from "@/hooks/useOllamaDockerConnect";
import { OllamaConnectionForm } from "./ollama/OllamaConnectionForm";
import { OllamaConnectionStatus } from "./ollama/OllamaConnectionStatus";
import { OllamaConnectionGuide } from "./ollama/OllamaConnectionGuide";

export const OllamaDockerConnect = () => {
  const {
    dockerAddress,
    setDockerAddress,
    customAddress,
    setCustomAddress,
    isConnecting,
    connectionStatus,
    connectToDocker,
    currentOrigin,
    useServerSideProxy,
    setUseServerSideProxy,
    autoRetryEnabled,
    toggleAutoRetry,
    isLocalhost
  } = useOllamaDockerConnect();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 text-primary mr-2" />
          Ollama Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OllamaConnectionForm
          dockerAddress={dockerAddress}
          setDockerAddress={setDockerAddress}
          customAddress={customAddress}
          setCustomAddress={setCustomAddress}
          isConnecting={isConnecting}
          connectToDocker={connectToDocker}
          currentOrigin={currentOrigin}
          useServerSideProxy={useServerSideProxy}
          setUseServerSideProxy={setUseServerSideProxy}
          autoRetryEnabled={autoRetryEnabled}
          toggleAutoRetry={toggleAutoRetry}
          isLocalhost={isLocalhost}
        />

        {connectionStatus && (
          <OllamaConnectionStatus connectionStatus={connectionStatus} />
        )}

        <OllamaConnectionGuide connectToDocker={connectToDocker} />
      </CardContent>
    </Card>
  );
};
