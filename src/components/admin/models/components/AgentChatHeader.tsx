
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bot, Trash2 } from "lucide-react";
import { AGENTS } from '../constants/agents';
import { UnifiedAISelector } from "@/components/ai/UnifiedAISelector";

interface AgentChatHeaderProps {
  selectedAgent: string;
  selectedModel: string;
  handleAgentChange: (value: string) => void;
  handleModelChange: (modelId: string) => void;
  clearChat: () => void;
  apiAvailable: boolean;
}

export const AgentChatHeader: React.FC<AgentChatHeaderProps> = ({
  selectedAgent,
  selectedModel,
  handleAgentChange,
  handleModelChange,
  clearChat,
  apiAvailable
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Chat with AI Agents</h3>
        <div className="flex items-center space-x-2">
          <Select value={selectedAgent} onValueChange={handleAgentChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearChat}
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm">AI Model:</span>
        <UnifiedAISelector 
          selectedModelId={selectedModel}
          onModelChange={handleModelChange}
          showSettings={false}
        />
      </div>
    </>
  );
};
