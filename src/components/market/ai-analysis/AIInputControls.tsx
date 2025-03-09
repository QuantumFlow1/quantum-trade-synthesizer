
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, RotateCcw } from "lucide-react";

interface AIInputControlsProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
  isLoading: boolean;
}

export const AIInputControls = ({ onSendMessage, onResetChat, isLoading }: AIInputControlsProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-auto">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onResetChat}
        className="flex-shrink-0"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Input
        placeholder="Ask about market trends, analysis, or trading insights..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow"
        disabled={isLoading}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={!inputValue.trim() || isLoading}
        className="flex-shrink-0"
      >
        <SendIcon className="h-4 w-4 mr-2" />
        Send
      </Button>
    </div>
  );
};
