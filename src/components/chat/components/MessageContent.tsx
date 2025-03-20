
import React from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';

interface MessageContentProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function MessageContent({ role, content, timestamp }: MessageContentProps) {
  // Check if content is an error message
  const isErrorMessage = content.toLowerCase().includes('error:') || 
                        content.toLowerCase().includes('failed to') ||
                        content.toLowerCase().includes('api error');
  
  return (
    <div className="flex items-start">
      <div className={`mr-3 mt-1 ${role === 'user' ? 'text-blue-400' : isErrorMessage ? 'text-red-400' : 'text-green-400'}`}>
        {role === 'user' ? (
          <User className="w-5 h-5" />
        ) : isErrorMessage ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <p className={`whitespace-pre-line text-base leading-relaxed font-normal ${isErrorMessage ? 'text-red-200 bg-red-950/30 p-2 rounded' : 'text-gray-50'}`}>
          {content || "Error: Empty message content"}
        </p>
        <p className={`text-xs mt-2 ${role === 'user' ? 'text-blue-400' : isErrorMessage ? 'text-red-400' : 'text-gray-400'}`}>
          {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
