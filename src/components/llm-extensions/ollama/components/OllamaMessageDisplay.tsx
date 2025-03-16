
import React from 'react';
import { OllamaMessage } from '../types/ollamaTypes';

interface OllamaMessageDisplayProps {
  message: OllamaMessage;
  selectedModel: string;
}

export function OllamaMessageDisplay({ message, selectedModel }: OllamaMessageDisplayProps) {
  return (
    <div
      className={`flex gap-2 p-3 rounded-lg ${
        message.role === 'user' ? 'bg-primary/10' : 'bg-muted'
      }`}
    >
      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20">
        {message.role === 'user' ? 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> : 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path><path d="M3 7v10a1 1 0 0 0 1 1h9"></path><path d="M18 12h-2.5a1.5 1.5 0 0 0 0 3H18h.5"></path><line x1="9" y1="17" x2="9" y2="6"></line><line x1="12" y1="17" x2="12" y2="11"></line></svg>
        }
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">
          {message.role === 'user' ? 'You' : selectedModel || 'Assistant'}
        </p>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
