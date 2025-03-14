
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
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
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none min-h-[40px] max-h-[120px]"
        disabled={isLoading}
        onKeyDown={handleKeyDown}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputMessage.trim()} 
        className="h-10 self-end"
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
