
import React from 'react';
import { AlertTriangle, Server, InfoIcon, ExternalLink } from 'lucide-react';
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
  // Extract origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const isLocalOrigin = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Check if this is likely a CORS error
  const isCorsError = connectionError?.toLowerCase().includes('cors') || 
                      connectionError?.toLowerCase().includes('failed to fetch') ||
                      connectionError?.toLowerCase().includes('cross-origin');
  
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
            <span>AI responses are in simulation mode due to connection issues</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p>Host: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{ollamaHost}</code></p>
        
        {connectionError && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">
              {isCorsError ? (
                <div className="space-y-2">
                  <p className="font-semibold">CORS Error: Browser security is blocking the connection</p>
                  
                  <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs space-y-3">
                    <div>
                      <p className="font-medium mb-1">To fix this issue, start Ollama with:</p>
                      <div className="bg-black text-white p-2 rounded overflow-x-auto">
                        <code>OLLAMA_ORIGINS={currentOrigin} ollama serve</code>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Or with Docker:</p>
                      <div className="bg-black text-white p-2 rounded overflow-x-auto">
                        <code>docker run -d -p 11434:11434 -e OLLAMA_ORIGINS={currentOrigin} ollama/ollama</code>
                      </div>
                    </div>
                    
                    {!isLocalOrigin && (
                      <div className="flex items-start p-2 bg-amber-50 dark:bg-amber-900/30 rounded border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          <strong>Note:</strong> You are accessing this app from {currentOrigin}. 
                          The CORS error occurs because Ollama's default security settings only allow 
                          connections from localhost.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p>{connectionError}</p>
                  
                  <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <p className="text-xs font-medium">Troubleshooting suggestions:</p>
                    <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                      <li>Make sure Ollama is running on your local machine</li>
                      <li>Check if it's running on a different port than 11434</li>
                      <li>Try restarting Ollama: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ollama serve</code></li>
                    </ul>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
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
