
import React from 'react';
import { AlertTriangle, Server, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const isCorsError = connectionError?.toLowerCase().includes('cors');
  
  return (
    <div className="bg-slate-50 p-3 rounded-md text-sm space-y-2 mb-4">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">
          {isConnected ? 'Connected to Ollama' : 'Not connected to Ollama'}
        </span>
      </div>
      
      <div className="space-y-1 pl-4">
        <p>Host: <code className="bg-slate-100 px-1 rounded">{ollamaHost}</code></p>
        {connectionError && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">
              {connectionError}
              
              {isCorsError && (
                <div className="mt-2 bg-gray-100 p-2 rounded text-xs">
                  <p className="font-medium">CORS errors occur due to browser security restrictions.</p>
                  <p className="mt-1">To fix this, start Ollama with this command:</p>
                  <pre className="bg-black text-white p-2 rounded mt-1 overflow-x-auto">
                    {`OLLAMA_ORIGINS=${currentOrigin} ollama serve`}
                  </pre>
                  <p className="mt-2">Or with Docker:</p>
                  <pre className="bg-black text-white p-2 rounded mt-1 overflow-x-auto">
                    {`docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama \\
  -e OLLAMA_ORIGINS=${currentOrigin} \\
  ollama/ollama`}
                  </pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex space-x-2 mt-3">
          <button 
            onClick={refreshModels}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            Refresh
          </button>
          <button 
            onClick={toggleConnectionInfo}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
