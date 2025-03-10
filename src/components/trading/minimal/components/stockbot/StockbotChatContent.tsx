
import { CardContent } from "@/components/ui/card";
import { useStockbot } from "../../contexts/StockbotContext";
import { StockbotHeader } from "../StockbotHeader";
import { StockbotMessages } from "../StockbotMessages";
import { StockbotInput } from "../StockbotInput";
import { StockbotAlerts } from "./StockbotAlerts";
import { StockbotKeyDialog } from "./StockbotKeyDialog";

export const StockbotChatContent = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    reloadApiKeys,
    apiKeyStatus,
    messagesEndRef,
    handleDialogClose,
    handleApiKeySuccess
  } = useStockbot();

  return (
    <>
      <StockbotHeader 
        isSimulationMode={isSimulationMode}
        setIsSimulationMode={setIsSimulationMode}
        clearChat={clearChat}
        showApiKeyDialog={showApiKeyDialog}
        hasApiKey={apiKeyStatus.exists}
      />

      <CardContent className="flex-grow p-0 overflow-hidden flex flex-col">
        <StockbotAlerts
          hasApiKey={apiKeyStatus.exists}
          isSimulationMode={isSimulationMode}
          showApiKeyDialog={showApiKeyDialog}
          setIsSimulationMode={setIsSimulationMode}
          handleForceReload={reloadApiKeys}
        />
        
        <StockbotMessages 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          hasApiKey={apiKeyStatus.exists}
          onConfigureApiKey={showApiKeyDialog}
        />
        
        <StockbotInput 
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>

      <StockbotKeyDialog
        isKeyDialogOpen={isKeyDialogOpen}
        handleDialogClose={handleDialogClose}
        onSuccessfulSave={handleApiKeySuccess}
      />
    </>
  );
};
