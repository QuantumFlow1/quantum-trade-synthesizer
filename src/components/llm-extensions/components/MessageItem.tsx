
import React from 'react';
import { type Message } from '../hooks/useOpenAIChat';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-2 p-2 rounded-lg',
        isUser ? 'bg-primary/10' : 'bg-muted'
      )}
    >
      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20">
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
