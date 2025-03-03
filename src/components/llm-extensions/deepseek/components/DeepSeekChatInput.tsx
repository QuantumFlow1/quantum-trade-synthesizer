
import { SendIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DeepSeekChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isProcessing: boolean;
  isDisabled: boolean;
  placeholder: string;
}

export function DeepSeekChatInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isProcessing,
  isDisabled,
  placeholder
}: DeepSeekChatInputProps) {
  return (
    <div className="flex w-full gap-2">
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1 resize-none"
        disabled={isProcessing || isDisabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={!inputMessage.trim() || isProcessing || isDisabled} 
        className="h-full"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
