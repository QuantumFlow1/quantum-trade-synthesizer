
import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log("Messages updated, current count:", messages.length);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Bot className="w-16 h-16 mb-6 opacity-20" />
        <p className="text-lg">Begin een gesprek met AI.</p>
        <p className="text-sm mt-2">Stel een vraag in het tekstvak hieronder.</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((message) => {
        // Convert timestamp to Date object if it's not already
        const timestamp = message.timestamp instanceof Date 
          ? message.timestamp 
          : new Date(message.timestamp);
          
        console.log(`Rendering message: ${message.id}, role: ${message.role}, content length: ${message.content?.length || 0}`);
        
        return (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 chat-message`}
            data-message-id={message.id}
          >
            <div 
              className={`rounded-lg px-5 py-3 max-w-[85%] flex ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className={`mr-3 mt-1 ${message.role === 'user' ? 'text-white' : 'text-indigo-600'}`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
}
