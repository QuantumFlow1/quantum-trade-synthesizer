
import React from 'react';
import { useOllamaChat } from './hooks/useOllamaChat';
import { OllamaChatHeader } from './components/OllamaChatHeader';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaEmptyState } from './components/OllamaEmptyState';
import { OllamaMessageList } from './components/OllamaMessageList';
import { OllamaConnectionInfo } from './components/OllamaConnectionInfo';
import { OllamaSettings } from './components/OllamaSettings';
import { toast } from '@/components/ui/use-toast';
import { OllamaNoModelsAlert } from './components/OllamaNoModelsAlert';

export function OllamaChat() {
  const {
    ollamaHost,
    selectedModel,
    inputMessage,
    messages,
    isLoading,
    models,
    isLoadingModels,
    isConnected,
    connectionError,
    showSettings,
    showConnectionInfo,
    toggleSettings,
    toggleConnectionInfo,
    updateHost,
    setSelectedModel,
    setInputMessage,
    clearChat,
    sendMessage,
    refreshModels
  } = useOllamaChat();

  // Notification for available models on component mount
  React.useEffect(() => {
    if (isConnected && models.length > 0) {
      const storedNotification = localStorage.getItem('ollamaModelsNotificationShown');
      if (!storedNotification) {
        toast({
          title: "Local Ollama Models Available",
          description: `Found ${models.length} models. You can chat with your local Ollama models!`,
        });
        localStorage.setItem('ollamaModelsNotificationShown', 'true');
      }
    }
  }, [isConnected, models]);

  // When settings are shown
  if (showSettings) {
    return (
      <OllamaSettings
        ollamaHost={ollamaHost}
        updateHost={updateHost}
        isConnected={isConnected}
        isLoadingModels={isLoadingModels}
        connectionError={connectionError}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        refreshModels={refreshModels}
        toggleSettings={toggleSettings}
      />
    );
  }

  // When connection info is shown
  if (showConnectionInfo) {
    return (
      <OllamaConnectionInfo
        ollamaHost={ollamaHost}
        updateHost={updateHost}
        toggleConnectionInfo={toggleConnectionInfo}
        isConnected={isConnected}
        connectionError={connectionError}
        refreshModels={refreshModels}
      />
    );
  }

  // Main chat layout
  return (
    <div className="flex flex-col h-full">
      <OllamaChatHeader
        isConnected={isConnected}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        toggleSettings={toggleSettings}
        toggleConnectionInfo={toggleConnectionInfo}
        clearChat={clearChat}
      />

      <div className="flex-1 overflow-auto p-4">
        {isConnected && models.length === 0 && !isLoadingModels ? (
          <OllamaNoModelsAlert refreshModels={refreshModels} />
        ) : isConnected && models.length > 0 ? (
          <OllamaMessageList messages={messages} selectedModel={selectedModel} />
        ) : (
          <OllamaEmptyState
            isConnected={isConnected}
            connectionError={connectionError}
            toggleSettings={toggleSettings}
            toggleConnectionInfo={toggleConnectionInfo}
          />
        )}
      </div>

      <div className="p-4 border-t">
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
