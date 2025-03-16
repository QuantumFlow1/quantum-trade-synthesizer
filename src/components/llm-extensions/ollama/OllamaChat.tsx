
import React, { useRef } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OllamaSettings } from './components/OllamaSettings';
import { OllamaMessageList } from './components/OllamaMessageList';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaEmptyState } from './components/OllamaEmptyState';
import { OllamaNoModelsAlert } from './components/OllamaNoModelsAlert';
import { OllamaConnectionInfo } from './components/OllamaConnectionInfo';
import { useOllamaChat } from './hooks/useOllamaChat';

export function OllamaChat() {
  const {
    ollamaHost,
    selectedModel,
    inputMessage,
    messages,
    isLoading,
    showSettings,
    showConnectionInfo,
    models,
    isLoadingModels,
    isConnected,
    connectionError,
    updateHost,
    setSelectedModel,
    setInputMessage,
    toggleSettings,
    toggleConnectionInfo,
    sendMessage,
    refreshModels
  } = useOllamaChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const renderConnectionInfo = () => (
    <OllamaConnectionInfo 
      isConnected={isConnected}
      host={ollamaHost}
      selectedModel={selectedModel}
      modelsAvailable={models.length}
    />
  );

  const renderNoModelsAlert = () => {
    if (isConnected && models.length === 0) {
      return <OllamaNoModelsAlert refreshModels={refreshModels} />;
    }
    return null;
  };

  // Render empty state if not connected or no models
  if (!isConnected || (isConnected && models.length === 0 && !showSettings)) {
    return (
      <div className="h-[500px] overflow-hidden">
        <OllamaEmptyState 
          isConnected={isConnected}
          connectionError={connectionError}
          models={models}
          isLoadingModels={isLoadingModels}
          toggleSettings={toggleSettings}
          toggleConnectionInfo={toggleConnectionInfo}
        />
      </div>
    );
  }

  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
          <h3 className="font-medium">
            {selectedModel ? `Model: ${selectedModel}` : 'Ollama Chat'}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSettings}
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow overflow-auto p-4">
        {showSettings ? (
          <OllamaSettings
            ollamaHost={ollamaHost}
            updateHost={updateHost}
            refreshModels={refreshModels}
            isLoadingModels={isLoadingModels}
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            renderNoModelsAlert={renderNoModelsAlert}
            renderConnectionInfo={renderConnectionInfo}
            showConnectionInfo={showConnectionInfo}
          />
        ) : (
          <OllamaMessageList 
            messages={messages} 
            selectedModel={selectedModel} 
          />
        )}
      </div>

      <div className="p-3 border-t mt-auto">
        <OllamaChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          showSettings={showSettings}
          models={models}
        />
      </div>
    </div>
  );
}
