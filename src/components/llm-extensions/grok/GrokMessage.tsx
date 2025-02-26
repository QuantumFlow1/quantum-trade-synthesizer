
import { User, Zap } from 'lucide-react';
import { Message } from '../deepseek/types';

interface GrokMessageProps {
  message: Message;
}

export function GrokMessage({ message }: GrokMessageProps) {
  // Make sure timestamp is a Date object
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
    
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`rounded-lg px-4 py-2 max-w-[85%] flex ${
          message.role === 'user' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 border border-gray-200'
        }`}
      >
        <div className={`mr-2 mt-1 ${message.role === 'user' ? 'text-white' : 'text-purple-600'}`}>
          {message.role === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <p className="whitespace-pre-line text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
            {timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
