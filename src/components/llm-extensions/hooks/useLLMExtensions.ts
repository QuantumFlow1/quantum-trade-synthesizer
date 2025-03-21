
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
  const { connectionStatus, checkConnectionStatusForLLM, setConnectionStatus } = useConnectionStatus();
  
  // Get API key dialog management
  const { isApiKeyDialogOpen, currentLLM, configureApiKey, setIsApiKeyDialogOpen } = useApiKeyDialog();
  
  // Ensure connection status accurately reflects the enabled state
  const checkConnectionWithEnabledState = useCallback((llm: string) => {
    return checkConnectionStatusForLLM(llm, enabledLLMs[llm]);
  }, [enabledLLMs, checkConnectionStatusForLLM]);
  
  // Get LLM toggle functionality
  const { toggleLLM } = useExtensionsToggle(
    enabledLLMs, 
    setEnabledLLMs, 
    activeTab, 
    setActiveTab, 
    checkConnectionWithEnabledState
  );
  
  // Update connection statuses for disabled LLMs
  const updateConnectionStatusForDisabledLLMs = useCallback(() => {
    Object.entries(enabledLLMs).forEach(([llm, enabled]) => {
      if (!enabled && connectionStatus[llm] === 'connected') {
        console.log(`${llm} is disabled but shows as connected. Updating status.`);
        setConnectionStatus(prev => ({ ...prev, [llm]: 'disconnected' }));
      }
    });
  }, [enabledLLMs, connectionStatus, setConnectionStatus]);
  
  // Call this once on hook initialization
  updateConnectionStatusForDisabledLLMs();
  
  // Setup API key event listeners
  useApiKeyEvents(enabledLLMs, checkConnectionWithEnabledState);
  
  // Close API key dialog and recheck connection
  const closeApiKeyDialog = useCallback(() => {
    setIsApiKeyDialogOpen(false);
    // Re-check connection after closing dialog
    if (currentLLM) {
      checkConnectionWithEnabledState(currentLLM);
    }
  }, [currentLLM, checkConnectionWithEnabledState, setIsApiKeyDialogOpen]);
  
  return {
    activeTab,
    setActiveTab,
    enabledLLMs,
    connectionStatus,
    toggleLLM,
    checkConnectionStatusForLLM: checkConnectionWithEnabledState,
    configureApiKey,
    isApiKeyDialogOpen,
    closeApiKeyDialog,
    currentLLM
  };
}
