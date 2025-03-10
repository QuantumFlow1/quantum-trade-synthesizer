
import React, { forwardRef } from "react";
import { StockbotMessage } from "../hooks/stockbot/types";
import { EmptyState, LoadingIndicator, MessageItem } from "./stockbot/messages";
import { useContentParser } from "./stockbot/messages/ContentParser";

interface StockbotMessagesProps {
  messages: StockbotMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  hasApiKey: boolean;
  onConfigureApiKey: () => void;
}

export const StockbotMessages = forwardRef<HTMLDivElement, StockbotMessagesProps>(
  ({ messages, isLoading, messagesEndRef, hasApiKey, onConfigureApiKey }, ref) => {
    const { parseMessageContent } = useContentParser();
    
    const formatTimestamp = (timestamp: number | Date) => {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <EmptyState 
            hasApiKey={hasApiKey} 
            onConfigureApiKey={onConfigureApiKey} 
          />
        )}

        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            renderMessageContent={parseMessageContent}
            formatTimestamp={formatTimestamp}
          />
        ))}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef}></div>
      </div>
    );
  }
);

StockbotMessages.displayName = "StockbotMessages";
