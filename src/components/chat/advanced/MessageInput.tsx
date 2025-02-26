
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isGenerating: boolean;
  modelDisplayName: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isGenerating,
  modelDisplayName
}) => {
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage();
    }
  };

  // Handle keyboard shortcut (Ctrl+Enter) to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && inputMessage.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <Textarea
        className="w-full min-h-[120px] mb-2 resize-none"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Ask ${modelDisplayName} anything...`}
        disabled={isGenerating}
      />
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Press Ctrl+Enter to send</span>
        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={!inputMessage.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
