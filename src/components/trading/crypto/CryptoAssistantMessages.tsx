
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CryptoMessage } from './types';

interface CryptoAssistantMessagesProps {
  messages: CryptoMessage[];
}

export function CryptoAssistantMessages({ messages }: CryptoAssistantMessagesProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
        <Bot className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Crypto Trading Assistant</h3>
        <p className="max-w-md">
          Ask me about cryptocurrency prices, market trends, trading strategies, or specific coins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`flex max-w-[80%] ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </Avatar>
            
            <Card
              className={`p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content.includes("<function=") ? (
                <div className="crypto-function-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                  <div className="mt-2 text-xs opacity-70">
                    {message.functionCalls && 
                      `Using market data tools: ${message.functionCalls.map(f => f.name).join(', ')}`
                    }
                  </div>
                </div>
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
