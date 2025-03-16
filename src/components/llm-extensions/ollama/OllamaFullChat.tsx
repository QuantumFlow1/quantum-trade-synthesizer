
import React, { useState } from 'react';
import { useOllamaChat } from './hooks/useOllamaChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OllamaSettingsTabContent } from './components/OllamaSettingsTabContent';
import { OllamaChatHeader } from './components/OllamaChatHeader';
import { OllamaChatTabContent } from './components/OllamaChatTabContent';
import { useOllamaDockerConnect } from '@/hooks/useOllamaDockerConnect';
import { OllamaMessageList } from './components/OllamaMessageList';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaNoModelsAlert } from './components/OllamaNoModelsAlert';
import { OllamaEmptyState } from './components/OllamaEmptyState';

export function OllamaFullChat() {
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
    clearChat,
    toggleSettings,
    toggleConnectionInfo,
    sendMessage,
    refreshModels
  } = useOllamaChat();

  const {
    dockerAddress,
    setDockerAddress,
    customAddress,
    setCustomAddress,
    isConnecting,
    connectionStatus,
    connectToDocker,
    currentOrigin,
    useServerSideProxy,
    setUseServerSideProxy,
    autoRetryEnabled,
    toggleAutoRetry,
    isLocalhost
  } = useOllamaDockerConnect();

  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex flex-col h-full max-h-full">
      <OllamaChatHeader
        isConnected={isConnected}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        clearChat={clearChat}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsContent 
          value="chat" 
          className="flex-1 flex flex-col overflow-hidden mt-0 pt-0 border-0"
        >
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <OllamaEmptyState
                isConnected={isConnected}
                hasModels={models.length > 0}
              />
            ) : (
              <OllamaMessageList messages={messages} />
            )}
          </div>

          {models.length === 0 && isConnected && (
            <OllamaNoModelsAlert refreshModels={refreshModels} />
          )}

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
        </TabsContent>

        <TabsContent value="settings" className="mt-0 overflow-y-auto">
          <div className="p-4">
            <OllamaSettingsTabContent
              isConnected={isConnected}
              isLoadingModels={isLoadingModels}
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setActiveTab={setActiveTab}
              refreshModels={refreshModels}
              dockerAddress={dockerAddress}
              setDockerAddress={setDockerAddress}
              customAddress={customAddress}
              setCustomAddress={setCustomAddress}
              isConnecting={isConnecting}
              connectToDocker={connectToDocker}
              currentOrigin={currentOrigin}
              useServerSideProxy={useServerSideProxy}
              setUseServerSideProxy={setUseServerSideProxy}
              autoRetryEnabled={autoRetryEnabled}
              toggleAutoRetry={toggleAutoRetry}
              isLocalhost={isLocalhost}
              connectionError={connectionError}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
