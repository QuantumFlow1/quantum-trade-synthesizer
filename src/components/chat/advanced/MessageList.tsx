
import React, { useEffect, useRef } from 'react';
import { getModelDisplayName } from './utils';

interface Message {
  role: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  selectedModelName: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selectedModelName }) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Get the display name for the selected model
  const modelDisplayName = getModelDisplayName(selectedModelName);

  return (
    <div className="p-4 border rounded-md bg-gray-50 mb-4 h-[300px] overflow-y-auto flex flex-col">
      {messages.length > 0 ? (
        <div className="space-y-4 w-full">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg max-w-[85%] ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-900 ml-auto' 
                  : 'bg-white border border-gray-200 mr-auto'
              } chat-message`}
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold text-xs">
                  {message.role === 'user' ? 'You' : modelDisplayName}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 italic text-center">Send a message to start the conversation...</p>
        </div>
      )}
    </div>
  );
};

export default MessageList;
