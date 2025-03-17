
import React, { RefObject } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface AgentChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  apiAvailable: boolean;
  inputRef: RefObject<HTMLInputElement>;
  agentName: string;
}

export const AgentChatInput: React.FC<AgentChatInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyDown,
  isLoading,
  apiAvailable,
  inputRef,
  agentName
}) => {
  return (
    <div className="flex space-x-2">
      <Input
        ref={inputRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Ask your ${agentName || 'AI assistant'}...`}
        className="flex-1"
        disabled={isLoading || !apiAvailable}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={!inputMessage.trim() || isLoading || !apiAvailable}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
