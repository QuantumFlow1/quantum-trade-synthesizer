
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, RefreshCw, Database, ChevronDown, ChevronUp, AtomIcon, Calculator, BrainCircuit, CandlestickChart, LineChart } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AIInputControlsProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
  isLoading: boolean;
}

export function AIInputControls({ onSendMessage, onResetChat, isLoading }: AIInputControlsProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionCategory, setActiveSuggestionCategory] = useState<'quantum' | 'qubo' | 'live' | null>(null);
  
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

  // Original quantum suggestions
  const quantumSuggestions = [
    "How can I optimize a portfolio of 10 cryptocurrencies using QUBO?",
    "Explain the Markowitz Portfolio Selection model using quantum computing",
    "What's the difference between classical and quantum portfolio optimization?",
    "How does binary fractional series work with cryptocurrency investments?",
    "What are the limitations of quantum annealing for portfolio optimization?",
    "Compare QUBO and Ising models for financial optimization"
  ];

  // QUBO-specific suggestions
  const quboSuggestions = [
    "Generate a QUBO matrix for a portfolio of 5 assets with a budget of $10,000",
    "Explain the components of the QUBO objective function for portfolio optimization",
    "Show me how to convert a portfolio optimization problem to QUBO format",
    "What does each term in the QUBO formula represent in portfolio optimization?",
    "How does the Q matrix in QUBO capture the relationship between asset pairs?",
    "Demonstrate mapping from QUBO to Ising model for quantum annealing"
  ];
  
  // New live data QUBO suggestions
  const liveDataSuggestions = [
    "Generate a QUBO matrix using real-time market data for the top 5 cryptocurrencies",
    "Optimize a quantum portfolio using live crypto market data with a $5,000 budget",
    "Calculate the optimal portfolio allocation with real-time data using QUBO",
    "How would you formulate a QUBO matrix for Bitcoin, Ethereum, and 3 other top coins?",
    "Show me a real-time quantum portfolio analysis with risk weighting set to 0.3",
    "What's the most diversified crypto portfolio according to real-time QUBO analysis?"
  ];

  // Toggle between suggestion categories
  const toggleSuggestionCategory = (category: 'quantum' | 'qubo' | 'live') => {
    if (activeSuggestionCategory === category) {
      setActiveSuggestionCategory(null);
    } else {
      setActiveSuggestionCategory(category);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="mt-auto">
      <Collapsible
        open={showSuggestions}
        onOpenChange={setShowSuggestions}
        className="mb-2"
      >
        <div className="flex space-x-2 mb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs flex items-center justify-between border border-dashed ${
                activeSuggestionCategory === 'quantum' ? 'bg-primary/10' : ''
              }`}
              onClick={() => toggleSuggestionCategory('quantum')}
            >
              <span className="flex items-center">
                <AtomIcon className="h-3 w-3 mr-1" />
                Quantum Portfolio Questions
              </span>
              {activeSuggestionCategory === 'quantum' ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs flex items-center justify-between border border-dashed ${
                activeSuggestionCategory === 'qubo' ? 'bg-primary/10' : ''
              }`}
              onClick={() => toggleSuggestionCategory('qubo')}
            >
              <span className="flex items-center">
                <Calculator className="h-3 w-3 mr-1" />
                QUBO Matrix Examples
              </span>
              {activeSuggestionCategory === 'qubo' ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs flex items-center justify-between border border-dashed ${
                activeSuggestionCategory === 'live' ? 'bg-primary/10' : ''
              }`}
              onClick={() => toggleSuggestionCategory('live')}
            >
              <span className="flex items-center">
                <LineChart className="h-3 w-3 mr-1" />
                Live Data QUBO Analysis
              </span>
              {activeSuggestionCategory === 'live' ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="rounded bg-muted/20 p-2 grid grid-cols-1 gap-1">
          {activeSuggestionCategory === 'quantum' && 
            quantumSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-auto py-1 px-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <AtomIcon className="h-3 w-3 mr-1 text-primary/60" />
                {suggestion}
              </Button>
            ))
          }
          
          {activeSuggestionCategory === 'qubo' && 
            quboSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-auto py-1 px-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Calculator className="h-3 w-3 mr-1 text-primary/60" />
                {suggestion}
              </Button>
            ))
          }
          
          {activeSuggestionCategory === 'live' && 
            liveDataSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="ghost"
                size="sm"
                className="justify-start text-xs h-auto py-1 px-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <LineChart className="h-3 w-3 mr-1 text-primary/60" />
                {suggestion}
              </Button>
            ))
          }
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
