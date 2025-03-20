
import React from 'react';
import { Bot, User, AlertCircle, AlertTriangle } from 'lucide-react';

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
  
  // Check if this is simulated data (look for patterns in mock agent responses)
  const isSimulatedData = role === 'assistant' && 
                         (content.includes('as your trusted trading agent') ||
                          content.includes('my algorithms are indicating') ||
                          content.includes('I would recommend a cautious approach'));
  
  return (
    <div className="flex items-start">
      <div className={`mr-3 mt-1 ${
        role === 'user' 
          ? 'text-blue-400' 
          : isErrorMessage 
              ? 'text-red-400' 
              : isSimulatedData 
                  ? 'text-amber-400'
                  : 'text-green-400'
      }`}>
        {role === 'user' ? (
          <User className="w-5 h-5" />
        ) : isErrorMessage ? (
          <AlertCircle className="w-5 h-5" />
        ) : isSimulatedData ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        {isSimulatedData && (
          <div className="mb-2 text-xs font-medium px-2 py-1 bg-amber-950/30 text-amber-300 rounded inline-block">
            Simulated Data (Not Real-Time)
          </div>
        )}
        <p className={`whitespace-pre-line text-base leading-relaxed font-normal ${
          isErrorMessage 
            ? 'text-red-200 bg-red-950/30 p-2 rounded' 
            : isSimulatedData
                ? 'text-amber-100 bg-amber-950/20 p-2 rounded border border-amber-800/40'
                : 'text-gray-50'
        }`}>
          {content || "Error: Empty message content"}
          {isSimulatedData && (
            <span className="block mt-2 text-sm text-amber-300 italic">
              Note: This is simulated data, not actual market information.
            </span>
          )}
        </p>
        <p className={`text-xs mt-2 ${
          role === 'user' 
            ? 'text-blue-400' 
            : isErrorMessage 
                ? 'text-red-400'
                : isSimulatedData
                    ? 'text-amber-400'
                    : 'text-gray-400'
        }`}>
          {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
