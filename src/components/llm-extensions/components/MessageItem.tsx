
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types/chatTypes';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  // Make sure timestamp is a Date object
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
    
  return (
    <div 
      className={`flex p-4 ${message.role === 'user' ? 'bg-muted/50' : 'bg-background'} rounded-lg`}
    >
      <div className="mr-3">
        {message.role === 'user' ? (
          <User className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Bot className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <p className="whitespace-pre-line text-sm">{message.content}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
