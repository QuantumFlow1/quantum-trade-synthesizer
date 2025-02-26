
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  sendMessage, 
  isLoading 
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting message:", inputMessage);
    if (inputMessage.trim()) {
      sendMessage();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t p-4 flex items-end gap-2"
    >
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[80px] resize-none flex-1"
        disabled={isLoading}
        onKeyDown={(e) => {
          // Send message when pressing Enter without Shift
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={!inputMessage.trim() || isLoading}
        className="h-10"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
