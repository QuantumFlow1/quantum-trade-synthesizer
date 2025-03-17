
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAgentChat } from "./hooks/useAgentChat";
import { AgentChatHeader } from "./components/AgentChatHeader";
import { AgentChatHistory } from "./components/AgentChatHistory";
import { AgentChatInput } from "./components/AgentChatInput";
import { ApiKeyWarning } from "./components/ApiKeyWarning";

export const AIAgentsChatTab: React.FC = () => {
  const {
    selectedAgent,
    selectedModel,
    inputMessage,
    chatHistory,
    isLoading,
    apiAvailable,
    inputRef,
    messagesEndRef,
    setInputMessage,
    handleAgentChange,
    handleModelChange,
    handleSendMessage,
    handleKeyDown,
    clearChat,
    getCurrentAgentName
  } = useAgentChat();

  return (
    <div className="space-y-4">
      <AgentChatHeader
        selectedAgent={selectedAgent}
        selectedModel={selectedModel}
        handleAgentChange={handleAgentChange}
        handleModelChange={handleModelChange}
        clearChat={clearChat}
        apiAvailable={apiAvailable}
      />

      {!apiAvailable && <ApiKeyWarning />}

      <Card className="border rounded-lg">
        <CardContent className="p-4 space-y-4">
          <AgentChatHistory
            chatHistory={chatHistory}
            isLoading={isLoading}
            selectedAgent={selectedAgent}
            messagesEndRef={messagesEndRef}
          />
          
          <AgentChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
            isLoading={isLoading}
            apiAvailable={apiAvailable}
            inputRef={inputRef}
            agentName={getCurrentAgentName()}
          />
        </CardContent>
      </Card>
    </div>
  );
};
