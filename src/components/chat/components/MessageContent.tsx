
import React from 'react';
import { Bot, User } from 'lucide-react';

interface MessageContentProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function MessageContent({ role, content, timestamp }: MessageContentProps) {
  return (
    <div className="flex items-start">
      <div className={`mr-3 mt-1 ${role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
        {role === 'user' ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="whitespace-pre-line text-base leading-relaxed font-normal text-gray-50">
          {content || "Error: Empty message content"}
        </p>
        <p className={`text-xs mt-2 ${role === 'user' ? 'text-blue-400' : 'text-gray-400'}`}>
          {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
