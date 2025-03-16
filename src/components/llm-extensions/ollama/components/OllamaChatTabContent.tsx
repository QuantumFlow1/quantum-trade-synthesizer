
import React from 'react';
import { OllamaMessageList } from './OllamaMessageList';
import { OllamaEmptyState } from './OllamaEmptyState';
import { OllamaNoModelsAlert } from './OllamaNoModelsAlert';
import { OllamaMessage, OllamaModel } from '../types/ollamaTypes';
import { useOllamaChatTab } from '../hooks/useOllamaChatTab';

interface OllamaChatTabContentProps {
  messages: OllamaMessage[];
  isConnected: boolean;
  connectionError: string | null;
  models: OllamaModel[];
  isLoadingModels: boolean;
  toggleSettings: () => void;
  toggleConnectionInfo: () => void;
  selectedModel: string;
  refreshModels: () => void;
}

export function OllamaChatTabContent({
  messages,
  isConnected,
  connectionError,
  models,
  isLoadingModels,
  toggleSettings,
  toggleConnectionInfo,
  selectedModel,
  refreshModels
}: OllamaChatTabContentProps) {
  const { messagesEndRef } = useOllamaChatTab(messages);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <OllamaEmptyState
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            isLoadingModels={isLoadingModels}
            toggleSettings={toggleSettings}
            toggleConnectionInfo={toggleConnectionInfo}
          />
        ) : (
          <OllamaMessageList 
            messages={messages} 
            selectedModel={selectedModel} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {models.length === 0 && isConnected && (
        <OllamaNoModelsAlert refreshModels={refreshModels} />
      )}
    </div>
  );
}
