
import React from "react";
import { StockbotMessage } from "../../../hooks/stockbot/types";

interface MessageItemProps {
  message: StockbotMessage;
  renderMessageContent: (content: string) => React.ReactNode;
  formatTimestamp: (timestamp: number | Date) => string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  renderMessageContent, 
  formatTimestamp 
}) => {
  const isUserMessage = message.role === 'user';
  const messageContent = typeof message.content === 'string' 
    ? message.content 
    : String(message.content);
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUserMessage
            ? 'bg-blue-100 text-gray-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {renderMessageContent(messageContent)}
        <div
          className={`text-xs mt-1 ${
            isUserMessage ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
