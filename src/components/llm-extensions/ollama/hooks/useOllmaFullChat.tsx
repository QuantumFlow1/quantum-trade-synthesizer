
import { useState } from 'react';
import { useOllamaChat } from './useOllamaChat';
import { useOllamaDockerConnect } from '@/hooks/useOllamaDockerConnect';

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
    
    // Docker connection
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
    isLocalhost,
    
    // Tab state
    activeTab,
    setActiveTab
  };
}
