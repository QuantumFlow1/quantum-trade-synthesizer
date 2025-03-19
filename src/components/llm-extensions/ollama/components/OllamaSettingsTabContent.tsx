
import React from 'react';
import { Loader2, AlertTriangle, Server } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OllamaModel } from '../types/ollamaTypes';

export interface OllamaSettingsTabContentProps {
  ollamaHost: string;
  updateHost: (host: string) => void;
  refreshModels: () => void;
  isLoadingModels: boolean;
  isConnected: boolean;
  connectionError: string | null;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  setActiveTab: (tab: string) => void;
}

export function OllamaSettingsTabContent({
  ollamaHost,
  updateHost,
  refreshModels,
  isLoadingModels,
  isConnected,
  connectionError,
  models,
  selectedModel,
  setSelectedModel,
  setActiveTab
}: OllamaSettingsTabContentProps) {
  const isCorsError = connectionError?.includes('CORS') || connectionError?.includes('cross-origin') || connectionError?.includes('Failed to fetch');
  
  // Get current origin for CORS config
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Ollama Settings</h2>
        <Button variant="ghost" size="sm" onClick={() => setActiveTab('chat')}>
          Back to Chat
        </Button>
      </div>
      
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
            {isCorsError ? (
              <div className="space-y-3">
                <p className="font-semibold text-red-600 dark:text-red-400">
                  CORS Error: Your browser is blocking the connection to your local Ollama
                </p>
                
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm space-y-3">
                  <p className="font-medium">To fix this CORS error, start Ollama with this command:</p>
                  
                  <div className="bg-black text-white p-2 rounded overflow-x-auto">
                    <code>OLLAMA_ORIGINS={currentOrigin} ollama serve</code>
                  </div>
                  
                  <p className="font-medium mt-2">Or using Docker:</p>
                  
                  <div className="bg-black text-white p-2 rounded overflow-x-auto">
                    <code>docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama</code>
                  </div>
                </div>
              </div>
            ) : (
              <div>
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
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* No models warning */}
      {isConnected && models.length === 0 && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Models Found</AlertTitle>
          <AlertDescription>
            <p>Your Ollama instance is connected but doesn't have any models installed.</p>
            <div className="mt-2">
              <p className="text-sm mb-2">To install a model, run this command in your terminal:</p>
              <code className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm block">
                ollama pull llama3
              </code>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
      
      {/* Quick connection buttons */}
      <div className="space-y-2 pt-4 border-t">
        <p className="text-sm font-medium">Quick Connection:</p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              updateHost('http://localhost:11434');
              refreshModels();
            }}
          >
            localhost:11434
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              updateHost('http://127.0.0.1:11434');
              refreshModels();
            }}
          >
            127.0.0.1:11434
          </Button>
        </div>
      </div>
    </div>
  );
}
