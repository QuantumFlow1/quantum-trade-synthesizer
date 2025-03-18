
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface StockbotInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const StockbotInput: React.FC<StockbotInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSubmit, 
  isLoading
}) => {
  return (
    <div className="p-4 border-t">
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          onSubmit(); 
        }} 
        className="flex space-x-2"
      >
        <Input
          className="flex-1"
          placeholder="Stel een vraag over de markt..."
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};
