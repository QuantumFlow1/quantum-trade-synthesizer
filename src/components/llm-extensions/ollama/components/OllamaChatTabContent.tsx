
import React, { useRef } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OllamaMessageList } from './OllamaMessageList';
import { Badge } from '@/components/ui/badge';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaChatTabContentProps {
  isConnected: boolean;
  models: OllamaModel[];
  messages: any[];
  selectedModel: string;
  setActiveTab: (tab: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function OllamaChatTabContent({
  isConnected,
  models,
  messages,
  selectedModel,
  setActiveTab,
  messagesEndRef
}: OllamaChatTabContentProps) {
  // Show the message list if we're connected and have models available
  if (isConnected && models.length > 0) {
    return (
      <>
        <OllamaMessageList 
          messages={messages} 
          selectedModel={selectedModel} 
        />
        <div ref={messagesEndRef} />
      </>
    );
  } 
  
  // Show empty state if not connected or no models
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Connect to Ollama</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {isConnected ? 
          "No models found. Install models in Ollama to start chatting." :
          "Connect to your local Ollama instance to start chatting."}
      </p>
      
      {isConnected && models.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Install a model with:</p>
          <code className="bg-amber-100 px-2 py-1 rounded">ollama pull llama3</code>
        </div>
      )}
      
      <Button
        onClick={() => setActiveTab("settings")}
        variant="outline"
      >
        <Bot className="h-4 w-4 mr-2" />
        Go to Settings
      </Button>
    </div>
  );
}
