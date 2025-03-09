
import { format } from 'date-fns';
import { UserIcon, Bot } from 'lucide-react';
import { Message } from '../deepseek/types';

interface MessageProps {
  message: Message;
}

export function ClaudeMessage({ message }: MessageProps) {
  const formattedTime = message.timestamp instanceof Date 
    ? format(message.timestamp, 'HH:mm') 
    : 'Unknown time';
  
  // Helper function to handle message content rendering safely
  const renderMessageContent = () => {
    // Make sure we have content to display
    if (!message.content) {
      return <p className="text-red-500">Empty message</p>;
    }
    
    try {
      // Split by newlines and create paragraphs for each line
      return message.content.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        return <p key={i} className="mb-2 break-words whitespace-pre-wrap">{line}</p>;
      });
    } catch (error) {
      console.error('Error rendering message content:', error);
      return <p className="text-red-500">Error displaying message</p>;
    }
  };

  return (
    <div className={`flex gap-3 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Bot className="h-5 w-5 text-green-600" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${message.role === 'assistant' ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-lg ${
            message.role === 'assistant'
              ? 'bg-green-50 border border-green-100 text-gray-800'
              : 'bg-indigo-100 text-indigo-900'
          }`}
        >
          <div className="prose prose-sm">{renderMessageContent()}</div>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">{formattedTime}</span>
      </div>
      
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <UserIcon className="h-5 w-5 text-indigo-600" />
        </div>
      )}
    </div>
  );
}
