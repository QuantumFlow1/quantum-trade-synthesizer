
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  isOffline?: boolean;
  disabled?: boolean;
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  isOffline = false,
  disabled = false
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading && !disabled) {
      sendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && !disabled) {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage();
      }
    }
  };

  // Get placeholder text based on state
  const getPlaceholderText = () => {
    if (disabled) return "Connection required to send messages...";
    if (isOffline) return "Offline mode - limited functionality available";
    return "Type a message...";
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={getPlaceholderText()}
          className="flex-1 min-h-[60px] max-h-[120px] resize-none"
          disabled={isLoading || disabled}
          onKeyDown={handleKeyDown}
        />
        <Button 
          type="submit" 
          disabled={!inputMessage.trim() || isLoading || disabled} 
          className="h-[60px]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}
