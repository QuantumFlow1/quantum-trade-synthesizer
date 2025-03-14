
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from './types/chat';
import { MessageContent } from './components/MessageContent';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
        <Bot className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Stel een vraag</h3>
        <p className="max-w-md">
          Ik kan u helpen met vragen over Ollama, Llama 3.3, of andere AI-gerelateerde onderwerpen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.role === 'user' 
              ? 'bg-primary text-primary-foreground ml-12' 
              : 'bg-muted mr-12'
          }`}
        >
          <MessageContent 
            role={message.role} 
            content={message.content}
            timestamp={message.timestamp}
          />
        </div>
      ))}
    </div>
  );
}
