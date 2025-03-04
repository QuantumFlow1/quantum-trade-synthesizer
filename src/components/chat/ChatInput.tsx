
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal, WifiOff } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isLoading: boolean;
  isOffline?: boolean;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  sendMessage, 
  isLoading,
  isOffline = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // Focus the textarea on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Skip if IME composition is in progress (for languages like Chinese, Japanese, Korean)
    if (isComposing) return;
    
    // Send message if Enter is pressed without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      if (inputMessage.trim() && !isLoading) {
        sendMessage();
      }
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={isOffline ? "Typ uw bericht (offline modus actief)..." : "Type your message..."}
          className="resize-none pr-14 min-h-[60px] max-h-[200px]"
          maxLength={2000}
          disabled={isLoading}
        />
        <Button
          className="absolute bottom-2 right-2"
          size="icon"
          disabled={!inputMessage.trim() || isLoading}
          onClick={() => {
            if (inputMessage.trim()) {
              sendMessage();
            }
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isOffline ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>
          {inputMessage.length}/2000
        </span>
        {isOffline && (
          <span className="text-amber-600 flex items-center">
            <WifiOff className="h-3 w-3 mr-1" /> Offline modus actief
          </span>
        )}
      </div>
    </div>
  );
}
