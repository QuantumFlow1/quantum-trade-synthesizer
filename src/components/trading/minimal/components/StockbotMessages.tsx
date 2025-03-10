
import React from 'react';
import { Loader2 } from 'lucide-react';
import { StockbotMessage } from '../hooks/stockbot/types';
import { ClaudeMessage } from '@/components/llm-extensions/claude/ClaudeMessage';

interface StockbotMessagesProps {
  messages: StockbotMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  hasApiKey: boolean;
  onConfigureApiKey: () => void;
}

export const StockbotMessages: React.FC<StockbotMessagesProps> = ({
  messages,
  isLoading,
  messagesEndRef,
  hasApiKey,
  onConfigureApiKey
}) => {
  return (
    <div className="flex-grow p-4 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <ClaudeMessage 
          key={message.id} 
          message={{ 
            id: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp
          }} 
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2 max-w-[80%]">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-600">Generating response...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
