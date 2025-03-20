
import React, { useEffect, useRef } from 'react';
import { getModelDisplayName } from './utils';
import { AlertTriangle } from 'lucide-react';

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

  // Check if any message contains simulated data
  const hasSimulatedData = messages.some(message => 
    message.role === 'assistant' && 
    typeof message.content === 'string' && (
      message.content.includes('as your trusted trading agent') ||
      message.content.includes('my algorithms are indicating') ||
      message.content.includes('I would recommend a cautious approach')
    )
  );

  return (
    <div className="p-4 border border-gray-700 rounded-md bg-gray-900 mb-4 h-[300px] overflow-y-auto flex flex-col">
      {hasSimulatedData && (
        <div className="bg-amber-900/30 border border-amber-700/50 text-amber-200 p-2 rounded-md mb-4 text-xs flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-amber-400" />
          <span>Using simulated data - actual market data unavailable</span>
        </div>
      )}

      {messages.length > 0 ? (
        <div className="space-y-4 w-full">
          {messages.map((message, index) => {
            // Log each message for debugging
            console.log(`Rendering message ${index}:`, message);
            
            // Additional check to ensure content is a string
            const messageContent = typeof message.content === 'string' 
              ? message.content 
              : JSON.stringify(message.content) || "Error: Invalid message content";
            
            // Check if this is simulated data
            const isSimulatedData = message.role === 'assistant' && 
              typeof message.content === 'string' && (
                message.content.includes('as your trusted trading agent') ||
                message.content.includes('my algorithms are indicating') ||
                message.content.includes('I would recommend a cautious approach')
              );
            
            return (
              <div 
                key={index} 
                className={`p-3 rounded-lg max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-blue-900 text-gray-50 ml-auto' 
                    : isSimulatedData
                      ? 'bg-amber-900/30 border border-amber-700/50 text-gray-50 mr-auto'
                      : 'bg-gray-800 text-gray-50 border border-gray-700 mr-auto'
                } chat-message`}
                data-message-index={index}
                data-message-role={message.role}
                data-is-simulated={isSimulatedData}
              >
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-xs text-gray-300">
                    {message.role === 'user' ? 'You' : modelDisplayName}
                  </span>
                  {isSimulatedData && (
                    <span className="ml-2 text-xs bg-amber-900/50 px-1 py-0.5 rounded text-amber-300">
                      Simulated
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap text-gray-50">
                  {messageContent || "Error: Empty message content"}
                </p>
                {isSimulatedData && (
                  <p className="mt-1 text-xs italic text-amber-400">
                    Note: This contains simulated market data, not actual information.
                  </p>
                )}
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
