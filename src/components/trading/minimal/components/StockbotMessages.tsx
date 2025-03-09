
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
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. Ask Stockbot something about trading.</p>
        </div>
      )}
      
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[85%] px-4 py-3 rounded-lg shadow-sm ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
            <p className={`text-xs mt-2 ${
              message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString ? message.timestamp.toLocaleTimeString() : 
               new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white border border-gray-200 shadow-sm rounded-lg rounded-tl-none px-4 py-3">
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
