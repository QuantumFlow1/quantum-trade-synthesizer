
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface StockbotInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export const StockbotInput: React.FC<StockbotInputProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading
}) => {
  return (
    <div className="p-3 border-t bg-white">
      <div className="flex space-x-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Stockbot about trading strategies..."
          className="flex-1 resize-none"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!inputMessage.trim() || isLoading} 
          className="h-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
