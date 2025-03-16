
import React, { useRef, useEffect } from 'react';
import { OllamaMessage } from '../types/ollamaTypes';
import { OllamaMessageDisplay } from './OllamaMessageDisplay';

interface OllamaMessageListProps {
  messages: OllamaMessage[];
  selectedModel: string;
}

export function OllamaMessageList({ messages, selectedModel }: OllamaMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Start chatting with {selectedModel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <OllamaMessageDisplay 
          key={message.id} 
          message={message} 
          selectedModel={selectedModel} 
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
