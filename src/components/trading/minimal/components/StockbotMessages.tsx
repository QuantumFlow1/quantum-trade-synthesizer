
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "../hooks/useStockbotChat";

interface StockbotMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const StockbotMessages: React.FC<StockbotMessagesProps> = ({ 
  messages, 
  isLoading,
  messagesEndRef 
}) => {
  return (
    <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] bg-white border border-gray-200 shadow-sm rounded-lg rounded-tl-none px-4 py-2">
            <div className="flex space-x-2 items-center">
              <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
              <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
              <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
