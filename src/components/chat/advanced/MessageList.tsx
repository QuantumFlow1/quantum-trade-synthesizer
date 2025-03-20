
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
    console.log("Advanced interface - Messages updated:", messages.length);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Get the display name for the selected model
  const modelDisplayName = getModelDisplayName(selectedModelName);

  return (
    <div className="p-4 border border-gray-700 rounded-md bg-gray-900 mb-4 h-[300px] overflow-y-auto flex flex-col">
      {messages.length > 0 ? (
        <div className="space-y-4 w-full">
          {messages.map((message, index) => {
            // Log each message for debugging
            console.log(`Rendering message ${index}:`, message);
            
            // Additional check to ensure content is a string
            const messageContent = typeof message.content === 'string' 
              ? message.content 
              : JSON.stringify(message.content) || "Error: Invalid message content";
            
            return (
              <div 
                key={index} 
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-blue-900 text-gray-50 ml-auto' 
                    : 'bg-gray-800 text-gray-50 border border-gray-700 mr-auto'
                } chat-message`}
                data-message-index={index}
                data-message-role={message.role}
              >
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-xs text-gray-300">
                    {message.role === 'user' ? 'You' : modelDisplayName}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap text-gray-50">
                  {messageContent || "Error: Empty message content"}
                </p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 italic text-center">Send a message to start the conversation...</p>
        </div>
      )}
    </div>
  );
}

export default MessageList;
