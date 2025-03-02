
import { User, Bot } from 'lucide-react';
import { Message } from '../deepseek/types';

interface ClaudeMessageProps {
  message: Message;
}

export function ClaudeMessage({ message }: ClaudeMessageProps) {
  const isUser = message.role === 'user';
  
  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className={`flex gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <div 
        className={`flex items-center justify-center rounded-full h-8 w-8 ${
          isUser ? 'bg-primary/10' : 'bg-green-500/10'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary" />
        ) : (
          <Bot className="h-4 w-4 text-green-500" />
        )}
      </div>
      
      <div 
        className={`rounded-lg p-3 flex-1 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div className="text-xs opacity-70 mt-1 text-right">
          {message.timestamp ? formatTimestamp(message.timestamp) : ''}
        </div>
      </div>
    </div>
  );
}
