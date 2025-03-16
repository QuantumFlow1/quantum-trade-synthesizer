
import React from 'react';
import { Loader2, RefreshCw, Server } from 'lucide-react';
import { OllamaConnectionForm } from '@/components/admin/models/ollama/OllamaConnectionForm';
import { OllamaConnectionStatus } from '@/components/admin/models/ollama/OllamaConnectionStatus';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaSettingsTabContentProps {
  isConnected: boolean;
  isLoadingModels: boolean;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setActiveTab: (tab: string) => void;
  refreshModels: () => void;
  dockerAddress: string;
  setDockerAddress: (address: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  isConnecting: boolean;
  connectToDocker: (address: string) => void;
  currentOrigin: string;
  useServerSideProxy: boolean;
  setUseServerSideProxy: (enabled: boolean) => void;
  autoRetryEnabled: boolean;
  toggleAutoRetry: () => void;
  isLocalhost: boolean;
  connectionError: string | null;
}

export function OllamaSettingsTabContent({
  isConnected,
  isLoadingModels,
  models,
  selectedModel,
  setSelectedModel,
  setActiveTab,
  refreshModels,
  dockerAddress,
  setDockerAddress,
  customAddress,
  setCustomAddress,
  isConnecting,
  connectToDocker,
  currentOrigin,
  useServerSideProxy,
  setUseServerSideProxy,
  autoRetryEnabled,
  toggleAutoRetry,
  isLocalhost,
  connectionError
}: OllamaSettingsTabContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Connection Settings</h3>
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
      </div>
      
      {connectionError && (
        <OllamaConnectionStatus connectionStatus={{ connected: false, error: connectionError }} />
      )}
      
      {isConnected && (
        <div className="space-y-4">
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-3">Available Models</h3>
            {isLoadingModels ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading models...</span>
              </div>
            ) : models.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {models.map((model) => (
                  <div 
                    key={model.name} 
                    className="border rounded p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedModel(model.name);
                      setActiveTab("chat");
                    }}
                  >
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(model.size / 1e9).toFixed(1)} GB
                      </div>
                    </div>
                    {selectedModel === model.name && (
                      <Badge variant="outline" className="bg-primary/10">Selected</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                <p>No models found. You need to install models in Ollama.</p>
                <p className="mt-2">Run <code className="bg-muted p-1 rounded">ollama pull llama3</code> to install Llama 3.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={refreshModels}
              variant="outline"
              size="sm"
              disabled={isLoadingModels}
            >
              {isLoadingModels ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Models
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
