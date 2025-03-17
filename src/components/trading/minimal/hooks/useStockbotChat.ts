
import { useEffect } from "react";
import { StockbotChatHook } from "./stockbot/types";
import { useApiKeyMonitor } from "./stockbot/useApiKeyMonitor";
import { useStockbotMessages } from "./stockbot/useStockbotMessages";
import { useDialogState } from "./stockbot/useDialogState";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  // Use our refactored hooks
  const { 
    hasGroqKey, 
    checkGroqApiKey, 
    isCheckingAdminKey,
    reloadApiKeys
  } = useApiKeyMonitor();
  
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  } = useStockbotMessages(marketData, hasGroqKey, checkGroqApiKey);
  
  const {
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    showApiKeyDialog
  } = useDialogState();
  
  // Perform a key check when component mounts
  useEffect(() => {
    // Delay the check slightly to ensure everything else is initialized
    const timer = setTimeout(() => {
      reloadApiKeys();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [reloadApiKeys]);
  
  // Return the interface to maintain compatibility
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey: hasGroqKey,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    // Convert reloadApiKeys to return Promise<void>
    reloadApiKeys: async () => {
      await reloadApiKeys();
      return;
    },
    isCheckingAdminKey
  };
};
