
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/chatTypes';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`rounded-lg px-4 py-2 max-w-[85%] flex ${
          message.role === 'user' 
            ? 'bg-orange-600 text-white' 
            : 'bg-gray-100 border border-gray-200'
        }`}
      >
        <div className={`mr-2 mt-1 ${message.role === 'user' ? 'text-white' : 'text-orange-600'}`}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <p className="whitespace-pre-line text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-orange-200' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
