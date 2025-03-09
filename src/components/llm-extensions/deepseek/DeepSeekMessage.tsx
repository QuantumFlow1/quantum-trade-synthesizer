
import { MessageSquare, User, Bot } from 'lucide-react';
import { Message } from '../types/chatTypes';

interface DeepSeekMessageProps {
  message: Message;
}

export function DeepSeekMessage({ message }: DeepSeekMessageProps) {
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`rounded-lg px-4 py-2 max-w-[85%] flex chat-bubble ${
          message.role === 'user' 
            ? 'bg-blue-600 text-white user-message' 
            : 'bg-gray-100 border border-gray-200 assistant-message'
        }`}
      >
        <div className={`mr-2 mt-1 ${message.role === 'user' ? 'text-white' : 'text-blue-600'}`}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <p className="whitespace-pre-line text-sm message-text">{message.content}</p>
          <p className={`text-xs mt-1 message-time ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
