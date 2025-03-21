
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useStockbotChat } from "./hooks/useStockbotChat";
import { StockbotHeader } from "./components/stockbot/StockbotHeader";
import { StockbotMessages } from "./components/StockbotMessages";
import { StockbotInput } from "./components/stockbot/StockbotInput";
import { StockbotApiKeyDialog } from "./components/stockbot/StockbotApiKeyDialog";
import { StockbotModelSelector } from "./components/stockbot/StockbotModelSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAgents } from "@/hooks/use-agents";
import { StockbotAgents } from "./components/stockbot/StockbotAgents";
import { Button } from "@/components/ui/button";
import { hasApiKey, getAvailableProviders } from "@/utils/apiKeyManager";

export function StockbotChat() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat,
    hasApiKey: hasGroqKey,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    reloadApiKeys,
    isCheckingAdminKey
  } = useStockbotChat();

  const { agents } = useAgents();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [availableProviders, setAvailableProviders] = useState<Record<string, boolean>>({});
  const [isUsingRealData, setIsUsingRealData] = useState<boolean>(true);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  
  // Get available API providers
  useEffect(() => {
    setAvailableProviders(getAvailableProviders());
  }, [hasGroqKey]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Toggle between real data and simulation data
  const toggleRealData = () => {
    setIsUsingRealData(!isUsingRealData);
  };

  // Filter agents for trading specialists
  const tradingAgents = agents.filter(agent => 
    agent.type === 'trader' || 
    agent.type === 'advisor' || 
    agent.name.toLowerCase().includes('trading') ||
    agent.name.toLowerCase().includes('portfolio')
  );

  return (
    <>
      <Card className="flex flex-col h-full border-muted-foreground/20">
        <StockbotHeader
          clearChat={clearChat}
          showApiKeyDialog={showApiKeyDialog}
          hasApiKey={hasGroqKey}
          isUsingRealData={isUsingRealData}
          toggleRealData={toggleRealData}
          isSimulationMode={isSimulationMode}
          setIsSimulationMode={setIsSimulationMode}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="agents">Trading Agents</TabsTrigger>
            <TabsTrigger value="models">LLM Models</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <CardContent className="flex-1 overflow-hidden p-0">
              <StockbotMessages 
                messages={messages} 
                isLoading={isLoading} 
                messagesEndRef={messagesEndRef}
                hasApiKey={hasGroqKey}
                onConfigureApiKey={showApiKeyDialog}
              />
            </CardContent>
            <StockbotInput
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="agents" className="flex-1 overflow-auto p-4">
            <StockbotAgents agents={tradingAgents} />
          </TabsContent>
          
          <TabsContent value="models" className="flex-1 overflow-auto p-4">
            <StockbotModelSelector 
              availableProviders={availableProviders}
              onConfigureApiKey={showApiKeyDialog}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <StockbotApiKeyDialog
        isOpen={isKeyDialogOpen}
        onOpenChange={setIsKeyDialogOpen}
        onSave={reloadApiKeys}
      />
    </>
  );
}

export default StockbotChat;
