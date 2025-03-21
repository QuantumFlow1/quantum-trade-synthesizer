
import { useCallback } from 'react';
import { useExtensionsState } from './useExtensionsState';
import { useConnectionStatus } from './useConnectionStatus';
import { useApiKeyDialog } from './useApiKeyDialog';
import { useExtensionsToggle } from './useExtensionsToggle';
import { useApiKeyEvents } from './useApiKeyEvents';

/**
 * Main hook for LLM extensions functionality
 * Composes smaller, more focused hooks
 */
export function useLLMExtensions() {
  // Get state management
  const { enabledLLMs, setEnabledLLMs, activeTab, setActiveTab } = useExtensionsState();
  
  // Get connection status management
  const { connectionStatus, checkConnectionStatusForLLM } = useConnectionStatus();
  
  // Get API key dialog management
  const { isApiKeyDialogOpen, currentLLM, configureApiKey, setIsApiKeyDialogOpen } = useApiKeyDialog();
  
  // Get LLM toggle functionality
  const { toggleLLM } = useExtensionsToggle(
    enabledLLMs, 
    setEnabledLLMs, 
    activeTab, 
    setActiveTab, 
    checkConnectionStatusForLLM
  );
  
  // Setup API key event listeners
  useApiKeyEvents(enabledLLMs, checkConnectionStatusForLLM);
  
  // Close API key dialog and recheck connection
  const closeApiKeyDialog = useCallback(() => {
    setIsApiKeyDialogOpen(false);
    // Re-check connection after closing dialog
    if (currentLLM) {
      checkConnectionStatusForLLM(currentLLM);
    }
  }, [currentLLM, checkConnectionStatusForLLM, setIsApiKeyDialogOpen]);
  
  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM,
    configureApiKey,
    isApiKeyDialogOpen,
    closeApiKeyDialog,
    currentLLM
  };
}
