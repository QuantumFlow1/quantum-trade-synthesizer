
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RefreshCw, Database, ChevronDown, ChevronUp, AtomIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AIInputControlsProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
  isLoading: boolean;
}

export function AIInputControls({ onSendMessage, onResetChat, isLoading }: AIInputControlsProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setShowSuggestions(false);
  };

  const quantumSuggestions = [
    "How can I optimize a portfolio of 10 cryptocurrencies using QUBO?",
    "Explain the Markowitz Portfolio Selection model using quantum computing",
    "What's the difference between classical and quantum portfolio optimization?",
    "How does binary fractional series work with cryptocurrency investments?",
    "What are the limitations of quantum annealing for portfolio optimization?",
    "Compare QUBO and Ising models for financial optimization"
  ];

  return (
    <div className="mt-auto">
      <Collapsible
        open={showSuggestions}
        onOpenChange={setShowSuggestions}
        className="mb-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mb-2 text-xs flex items-center justify-between border border-dashed"
          >
            <span className="flex items-center">
              <AtomIcon className="h-3 w-3 mr-1" />
              Quantum Portfolio Optimization Questions
            </span>
            {showSuggestions ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded bg-muted/20 p-2 grid grid-cols-1 gap-1">
          {quantumSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              className="justify-start text-xs h-auto py-1 px-2"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onResetChat}
          disabled={isLoading}
          title="Reset conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about market analysis, QUBO optimization, or portfolio strategies..."
            disabled={isLoading}
            className="pr-10"
          />
          {inputValue && (
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
