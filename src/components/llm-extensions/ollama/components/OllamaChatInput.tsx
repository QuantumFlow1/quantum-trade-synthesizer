
import React from 'react';
import { SendIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  isConnected: boolean;
  showSettings: boolean;
  models: OllamaModel[];
}

export function OllamaChatInput({
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  isConnected,
  showSettings,
  models
}: OllamaChatInputProps) {
  return (
    <div className="flex w-full gap-2">
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder={isConnected ? (models.length > 0 ? "Type your message..." : "Install models first") : "Connect to Ollama in settings first"}
        className="flex-1 resize-none min-h-[40px] max-h-[120px]"
        disabled={isLoading || !isConnected || showSettings || models.length === 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <Button 
        onClick={sendMessage} 
        disabled={isLoading || !inputMessage.trim() || !isConnected || showSettings || models.length === 0}
        className="h-10 self-end"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
