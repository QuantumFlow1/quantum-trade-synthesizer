
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { OllamaSettingsTabContent } from './components/OllamaSettingsTabContent';
import { OllamaChatHeader } from './components/OllamaChatHeader';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaChatTabContent } from './components/OllamaChatTabContent';
import { useOllamaFullChat } from './hooks/useOllmaFullChat';

export function OllamaFullChat() {
  const {
    // Chat state
    ollamaHost,
    selectedModel,
    inputMessage,
    messages,
    isLoading,
    models,
    isLoadingModels,
    isConnected,
    connectionError,
    
    // Chat actions
    updateHost,
    setSelectedModel,
    setInputMessage,
    clearChat,
    toggleSettings,
    toggleConnectionInfo,
    sendMessage,
    refreshModels,
    
    // Tab state
    activeTab,
    setActiveTab
  } = useOllamaFullChat();

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
          <OllamaChatTabContent
            messages={messages}
            isConnected={isConnected}
            connectionError={connectionError}
            models={models}
            isLoadingModels={isLoadingModels}
            toggleSettings={toggleSettings}
            toggleConnectionInfo={toggleConnectionInfo}
            selectedModel={selectedModel}
            refreshModels={refreshModels}
          />

          <div className="p-4 border-t">
            <OllamaChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              isLoading={isLoading}
              isConnected={isConnected}
              showSettings={false}
              models={models}
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0 overflow-y-auto">
          <div className="p-4">
            <OllamaSettingsTabContent
              ollamaHost={ollamaHost}
              updateHost={updateHost}
              isConnected={isConnected}
              isLoadingModels={isLoadingModels}
              models={models}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              setActiveTab={setActiveTab}
              refreshModels={refreshModels}
              connectionError={connectionError}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
