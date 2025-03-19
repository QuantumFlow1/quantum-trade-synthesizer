
import { useState } from 'react';
import { useOllamaChat } from './useOllamaChat';

export function useOllamaFullChat() {
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

  const [activeTab, setActiveTab] = useState('chat');

  return {
    // Chat state
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
  };
}
