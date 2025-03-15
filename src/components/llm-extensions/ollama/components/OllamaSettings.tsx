
import React from 'react';
import { Loader2, AlertTriangle, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OllamaSettingsProps {
  ollamaHost: string;
  updateHost: (host: string) => void;
  refreshModels: () => void;
  isLoadingModels: boolean;
  isConnected: boolean;
  connectionError: string | null;
  models: any[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  renderNoModelsAlert: () => React.ReactNode;
  renderConnectionInfo: () => React.ReactNode;
  showConnectionInfo: boolean;
}

export function OllamaSettings({
  ollamaHost,
  updateHost,
  refreshModels,
  isLoadingModels,
  isConnected,
  connectionError,
  models,
  selectedModel,
  setSelectedModel,
  renderNoModelsAlert,
  renderConnectionInfo,
  showConnectionInfo
}: OllamaSettingsProps) {
  return (
    <div className="space-y-4">
      {renderConnectionInfo && showConnectionInfo && renderConnectionInfo()}
      
      <div className="space-y-2">
        <Label htmlFor="ollama-host">Ollama Host</Label>
        <div className="flex gap-2">
          <Input 
            id="ollama-host"
            value={ollamaHost}
            onChange={(e) => updateHost(e.target.value)}
            placeholder="http://localhost:11434"
            className="flex-grow"
          />
          <Button 
            onClick={refreshModels}
            disabled={isLoadingModels}
          >
            {isLoadingModels ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
          </Button>
        </div>
      </div>
      
      {/* Display connection status */}
      {!isConnected && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            <p>Could not connect to Ollama. Please make sure:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Ollama is installed and running</li>
              <li>The host URL is correct (default: http://localhost:11434)</li>
              <li>No firewall is blocking the connection</li>
            </ul>
            {connectionError && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/50 rounded text-sm">
                <p className="font-semibold">Error details:</p>
                <p className="font-mono text-xs break-all">{connectionError}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* No models warning */}
      {renderNoModelsAlert && renderNoModelsAlert()}
      
      <div className="space-y-2">
        <Label htmlFor="model-select">Select Model</Label>
        <Select 
          value={selectedModel}
          onValueChange={setSelectedModel}
          disabled={!isConnected || models.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2">
        <p className="text-sm font-medium mb-1">Status:</p>
        <p className="text-sm">
          {isConnected 
            ? `Connected to Ollama. ${models.length} models available.` 
            : "Not connected to Ollama. Make sure Ollama is running on your machine."}
        </p>
      </div>
    </div>
  );
}
