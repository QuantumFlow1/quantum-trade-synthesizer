
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStockbotState } from "./hooks/stockbot/useStockbotState";
import { StockbotHeader } from "./components/stockbot/StockbotHeader";
import { StockbotMessageList } from "./components/stockbot/StockbotMessageList";
import { StockbotInput } from "./components/stockbot/StockbotInput";
import { StockbotApiKeyDialog } from "./components/stockbot/StockbotApiKeyDialog";

export function StockbotChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat: clearMessages
  } = useStockbotState();

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  useEffect(() => {
    // Check for API key in localStorage on component mount
    const storedKey = localStorage.getItem("stockbot-api-key");
    setHasApiKey(!!storedKey);
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("stockbot-api-key", apiKey.trim());
      setHasApiKey(true);
      setShowApiKeyDialog(false);
      setApiKey("");
    }
  };

  const clearChat = () => {
    clearMessages();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRealData = () => {
    setIsUsingRealData(!isUsingRealData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  return (
    <>
      <Card className="flex flex-col h-full border-muted-foreground/20">
        <StockbotHeader
          clearChat={clearChat}
          showApiKeyDialog={() => setShowApiKeyDialog(true)}
          hasApiKey={hasApiKey}
          isUsingRealData={isUsingRealData}
          toggleRealData={toggleRealData}
          isSimulationMode={isSimulationMode}
          setIsSimulationMode={setIsSimulationMode}
        />
        <CardContent className="flex-1 overflow-hidden p-0">
          <StockbotMessageList messages={messages} />
        </CardContent>
        <StockbotInput
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </Card>

      <StockbotApiKeyDialog
        isOpen={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onSave={handleSaveApiKey}
      />
    </>
  );
}

export default StockbotChat;
