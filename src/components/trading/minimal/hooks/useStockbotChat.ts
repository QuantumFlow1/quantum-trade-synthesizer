
import { useCallback } from "react";
import { useStockbotState } from "./stockbot/useStockbotState";
import { useStockbotApi } from "./stockbot/useStockbotApi";
import { StockbotChatHook } from "./stockbot/types";

export { ChatMessage } from "./stockbot/types";

export const useStockbotChat = (marketData: any[] = []): StockbotChatHook => {
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading, 
    setIsLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    clearChat,
    showApiKeyDialog
  } = useStockbotState();
  
  const { handleSendMessage: apiHandleSendMessage } = useStockbotApi(
    marketData,
    messages,
    setMessages,
    setIsLoading
  );
  
  // Wrapper for handleSendMessage to use the current inputMessage
  const handleSendMessage = useCallback(async () => {
    await apiHandleSendMessage(inputMessage, isSimulationMode);
    setInputMessage("");
  }, [apiHandleSendMessage, inputMessage, isSimulationMode, setInputMessage]);
  
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen
  };
};
