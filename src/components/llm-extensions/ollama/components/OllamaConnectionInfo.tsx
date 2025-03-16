
import React from 'react';

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
    <div className="bg-slate-50 p-3 rounded-md text-sm space-y-2 mb-4">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">
          {isConnected ? 'Connected to Ollama' : 'Not connected to Ollama'}
        </span>
      </div>
      
      <div className="space-y-1 pl-4">
        <p>Host: <code className="bg-slate-100 px-1 rounded">{ollamaHost}</code></p>
        {connectionError && <p className="text-red-500">Error: {connectionError}</p>}
        
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
