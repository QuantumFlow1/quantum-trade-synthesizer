
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
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-300">
        <Bot className="h-12 w-12 mb-4 opacity-70" />
        <h3 className="text-lg font-medium mb-2 text-gray-200">Stel een vraag</h3>
        <p className="max-w-md text-gray-300">
          Ik kan u helpen met vragen over Ollama, Llama 3.3, of andere AI-gerelateerde onderwerpen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => {
        // Check if the message contains an error
        const isErrorMessage = message.content.toLowerCase().includes('error:') || 
                              message.content.toLowerCase().includes('failed to') ||
                              message.content.toLowerCase().includes('api error');
        
        return (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-900 text-gray-50 ml-12' 
                : isErrorMessage
                  ? 'bg-red-900/50 border border-red-700 text-gray-50 mr-12'
                  : 'bg-gray-800 text-gray-50 mr-12'
            }`}
          >
            <MessageContent 
              role={message.role} 
              content={message.content}
              timestamp={message.timestamp}
            />
          </div>
        );
      })}
    </div>
  );
}
