
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '@/components/admin/types/chat-types';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AGENTS } from '../constants/agents';

interface AgentChatHistoryProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  selectedAgent: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const AgentChatHistory: React.FC<AgentChatHistoryProps> = ({
  chatHistory,
  isLoading,
  selectedAgent,
  messagesEndRef
}) => {
  return (
    <ScrollArea className="h-[350px] border rounded-md bg-background p-4">
      {chatHistory.map((message) => (
        <div 
          key={message.id} 
          className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`flex max-w-[80%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {message.role === 'user' ? 'You' : `${AGENTS.find(a => a.id === selectedAgent)?.name || 'AI'}`}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <div className="h-2 w-12 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};
