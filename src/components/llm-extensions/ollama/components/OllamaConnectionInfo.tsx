
import React from 'react';
import { Server, InfoIcon, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface OllamaConnectionInfoProps {
  isConnected: boolean;
  ollamaHost: string;
  connectionError: string | null;
  refreshModels: () => void;
  toggleConnectionInfo: () => void;
  updateHost: (host: string) => void;
}

export const OllamaConnectionInfo: React.FC<OllamaConnectionInfoProps> = ({
  isConnected,
  ollamaHost,
  connectionError,
  refreshModels,
  toggleConnectionInfo,
  updateHost
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm space-y-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            {isConnected ? 'Connected to Ollama' : 'Not connected to Ollama'}
          </span>
        </div>
        
        {!isConnected && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <InfoIcon className="h-3 w-3" />
            <span>AI responses are in simulation mode</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p>Host: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{ollamaHost}</code></p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              updateHost('http://localhost:11434');
              refreshModels();
            }}
            className="text-xs h-7"
          >
            Try localhost
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              updateHost('http://127.0.0.1:11434');
              refreshModels();
            }}
            className="text-xs h-7"
          >
            Try 127.0.0.1
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={refreshModels}
            className="text-xs h-7"
          >
            Refresh Connection
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleConnectionInfo}
            className="text-xs h-7"
          >
            Close
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground p-2 border border-slate-200 dark:border-slate-700 rounded mt-2">
          <p className="font-medium mb-1">Need help with Ollama?</p>
          <p>While connection issues are being fixed, your AI responses will come from simulation mode.</p>
          <p className="mt-1">
            Visit the 
            <a 
              href="https://github.com/ollama/ollama" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline mx-1 inline-flex items-center"
            >
              Ollama docs
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            for more help.
          </p>
        </div>
      </div>
    </div>
  );
};
