
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
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-blue-100 text-gray-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {renderMessageContent(typeof message.content === 'string' ? message.content : String(message.content))}
        <div
          className={`text-xs mt-1 ${
            message.role === 'user' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
