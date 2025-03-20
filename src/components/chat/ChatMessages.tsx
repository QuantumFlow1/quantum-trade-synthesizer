
import React from 'react';
import { Bot, User, AlertTriangle, Server } from 'lucide-react';
import { ChatMessage } from './types/chat';
import { MessageContent } from './components/MessageContent';

interface ChatMessagesProps {
  messages: ChatMessage[];
  adminPanelPath?: string;
}

export function ChatMessages({ messages, adminPanelPath }: ChatMessagesProps) {
  // Check if we have any simulated data responses
  const hasSimulatedData = messages.some(msg => 
    msg.role === 'assistant' && 
    (msg.content.includes('as your trusted trading agent') ||
     msg.content.includes('my algorithms are indicating') ||
     msg.content.includes('I would recommend a cautious approach'))
  );

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-300">
        <Bot className="h-12 w-12 mb-4 opacity-70" />
        <h3 className="text-lg font-medium mb-2 text-gray-200">Stel een vraag</h3>
        <p className="max-w-md text-gray-300">
          Ik kan u helpen met vragen over Ollama, Llama 3.3, of andere AI-gerelateerde onderwerpen.
        </p>
        {adminPanelPath && (
          <div className="mt-4">
            <a 
              href={adminPanelPath} 
              className="text-blue-400 hover:underline text-sm flex items-center"
            >
              <Server className="h-4 w-4 mr-1" />
              Configureer API sleutels in Admin Paneel
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasSimulatedData && (
        <div className="bg-amber-900/50 border border-amber-700 text-amber-100 p-3 rounded-md flex items-center mb-4">
          <Server className="h-5 w-5 mr-2 text-amber-400" />
          <div>
            <h4 className="font-medium text-amber-200">Gesimuleerde handelsdata wordt gebruikt</h4>
            <p className="text-sm">
              We kunnen geen real-time data ophalen. Sommige antwoorden bevatten gesimuleerde marktinformatie.
            </p>
            {adminPanelPath && (
              <a 
                href={adminPanelPath} 
                className="text-amber-200 hover:underline text-sm inline-flex items-center mt-1"
              >
                Configureer API sleutels in Admin Paneel
              </a>
            )}
          </div>
        </div>
      )}

      {messages.map((message, index) => {
        // Check if the message contains an error
        const isErrorMessage = message.content.toLowerCase().includes('error:') || 
                              message.content.toLowerCase().includes('failed to') ||
                              message.content.toLowerCase().includes('api error');
        
        // Check if the message appears to be simulated data
        const isSimulatedData = message.role === 'assistant' && 
                               (message.content.includes('as your trusted trading agent') ||
                                message.content.includes('my algorithms are indicating') ||
                                message.content.includes('I would recommend a cautious approach'));
        
        return (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-900 text-gray-50 ml-12' 
                : isErrorMessage
                  ? 'bg-red-900/50 border border-red-700 text-gray-50 mr-12'
                  : isSimulatedData
                    ? 'bg-amber-900/30 border border-amber-700/50 text-gray-50 mr-12'
                    : 'bg-gray-800 text-gray-50 mr-12'
            }`}
          >
            <MessageContent 
              role={message.role} 
              content={message.content}
              timestamp={message.timestamp}
            />
          </div>
        );
      })}
    </div>
  );
}
