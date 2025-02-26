
import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
}

export function ChatInput({ inputMessage, setInputMessage, sendMessage, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && inputMessage.trim()) {
      e.preventDefault();
      console.log("Sending message with Enter key:", inputMessage);
      sendMessage();
    }
  };

  const handleSendClick = () => {
    if (inputMessage.trim() && !isLoading) {
      console.log("Sending message with button click:", inputMessage);
      sendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex space-x-2">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Even geduld..." : "Typ je bericht... (Enter om te versturen)"}
          disabled={isLoading}
          className="flex-1 min-h-[60px] resize-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <Button
          onClick={handleSendClick}
          disabled={!inputMessage.trim() || isLoading}
          variant="default"
          size="icon"
          className={`bg-indigo-600 hover:bg-indigo-700 h-[60px] w-[60px] ${isLoading ? "animate-pulse" : ""}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
