
import React from 'react';
import { Message } from '../deepseek/types';
import { MessageSquare, User } from 'lucide-react';

interface ClaudeMessageProps {
  message: Message;
}

export const ClaudeMessage: React.FC<ClaudeMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`rounded-lg px-4 py-3 max-w-[85%] chat-message ${
          message.role === 'user' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 border border-gray-200'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className={`mt-1 ${message.role === 'user' ? 'text-white' : 'text-green-600'}`}>
            {message.role === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </div>
            <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
