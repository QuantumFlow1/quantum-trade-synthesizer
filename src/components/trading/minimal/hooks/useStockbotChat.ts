
import { useEffect } from "react";
import { StockbotChatHook } from "./stockbot/types";
import { useStockbotSettings } from "./stockbot/useStockbotSettings";
import { useApiKeyMonitor } from "./stockbot/useApiKeyMonitor";
import { useStockbotMessages } from "./stockbot/useStockbotMessages";
import { useDialogState } from "./stockbot/useDialogState";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  // Use our refactored hooks
  const { isSimulationMode, setIsSimulationMode, manuallySetMode } = useStockbotSettings();
  
  const { 
    hasGroqKey, 
    checkGroqApiKey, 
    reloadApiKeys,
    setManuallySetMode
  } = useApiKeyMonitor(isSimulationMode, setIsSimulationMode);
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  } = useStockbotMessages(marketData, hasGroqKey, isSimulationMode, async () => {
    const result = await checkGroqApiKey();
    return result;
  });
  
  const {
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    showApiKeyDialog
  } = useDialogState();
  
  // Keep manuallySetMode in sync between hooks
  useEffect(() => {
    setManuallySetMode(manuallySetMode.current);
  }, [manuallySetMode, setManuallySetMode]);
  
  // Return the same interface as before to maintain compatibility
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey: hasGroqKey,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    reloadApiKeys
  };
};
