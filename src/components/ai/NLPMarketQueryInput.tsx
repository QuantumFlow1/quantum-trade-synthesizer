
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Brain, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NLPMarketQueryInputProps {
  onQuerySubmit: (query: string) => void;
  isLoading: boolean;
}

export function NLPMarketQueryInput({ onQuerySubmit, isLoading }: NLPMarketQueryInputProps) {
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    onQuerySubmit(query);
    setQuery('');
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    // Optional: automatically submit after selecting an example
    onQuerySubmit(example);
  };

  const examples = [
    "Wat zijn de beste aandelen om vandaag te kopen?",
    "Hoe presteert Bitcoin ten opzichte van andere cryptocurrencies?",
    "Welke sectoren zullen de komende maand waarschijnlijk groeien?",
    "Geef me een analyse van tech-aandelen voor de lange termijn"
  ];

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Marktanalyse Assistent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Stel een vraag over de markt..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!query.trim() || isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Voorbeeldvragen:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleExampleClick(example)}
                  disabled={isLoading}
                >
                  <Sparkles className="mr-1 h-3 w-3 text-primary" />
                  {example.length > 25 ? example.substring(0, 25) + '...' : example}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
