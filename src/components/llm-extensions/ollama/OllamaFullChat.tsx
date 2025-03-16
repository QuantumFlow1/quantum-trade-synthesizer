
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useOllamaChat } from './hooks/useOllamaChat';
import { OllamaChatInput } from './components/OllamaChatInput';
import { OllamaChatHeader } from './components/OllamaChatHeader';
import { OllamaChatTabContent } from './components/OllamaChatTabContent';
import { OllamaSettingsTabContent } from './components/OllamaSettingsTabContent';
import { toast } from '@/components/ui/use-toast';

export function OllamaFullChat() {
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
    updateHost,
    setSelectedModel,
    setInputMessage,
    clearChat,
    sendMessage,
    refreshModels
  } = useOllamaChat();
  
  const [activeTab, setActiveTab] = useState<string>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dockerAddress, setDockerAddress] = useState('http://localhost:11434');
  const [customAddress, setCustomAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [useServerSideProxy, setUseServerSideProxy] = useState(false);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [currentOrigin, setCurrentOrigin] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  // Check if running on localhost
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
      setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const connectToDocker = async (address: string) => {
    setIsConnecting(true);
    try {
      updateHost(address);
      await refreshModels();
      setActiveTab("chat");
      toast({
        title: "Connection successful",
        description: `Connected to Ollama at ${address}`,
      });
    } catch (error) {
      console.error('Error connecting to Ollama:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to Ollama",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleAutoRetry = () => setAutoRetryEnabled(!autoRetryEnabled);

  return (
    <div className="h-[600px] flex flex-col">
      <OllamaChatHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        clearChat={clearChat}
      />

      <div className="flex-grow overflow-auto">
        <TabsContent value="chat" className="p-4 m-0 h-full overflow-auto">
          <OllamaChatTabContent 
            isConnected={isConnected}
            models={models}
            messages={messages}
            selectedModel={selectedModel}
            setActiveTab={setActiveTab}
            messagesEndRef={messagesEndRef}
          />
        </TabsContent>

        <TabsContent value="settings" className="m-0 p-4">
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
        </TabsContent>
      </div>

      <div className="p-3 border-t mt-auto">
        <OllamaChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          isConnected={isConnected}
          showSettings={activeTab === "settings"}
          models={models}
        />
      </div>
    </div>
  );
}
