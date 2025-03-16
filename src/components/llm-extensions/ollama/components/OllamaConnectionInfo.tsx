
import React from 'react';

export interface OllamaConnectionInfoProps {
  isConnected: boolean;
  host: string;
  selectedModel: string;
  modelsAvailable: number;
}

export const OllamaConnectionInfo: React.FC<OllamaConnectionInfoProps> = ({
  isConnected,
  host,
  selectedModel,
  modelsAvailable
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
        <p>Host: <code className="bg-slate-100 px-1 rounded">{host}</code></p>
        {selectedModel && <p>Selected model: <code className="bg-slate-100 px-1 rounded">{selectedModel}</code></p>}
        <p>Models available: {modelsAvailable}</p>
      </div>
    </div>
  );
};
