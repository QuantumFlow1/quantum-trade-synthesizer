
import React from 'react';
import { Card } from '@/components/ui/card';
import { MarketData } from '../types';
import { BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface MarketDataSummaryProps {
  marketData?: MarketData;
}

export function MarketDataSummary({ marketData }: MarketDataSummaryProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!marketData) {
    return (
      <Card className="p-3 mb-4 bg-muted/20 border-dashed border border-muted">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <BrainCircuit className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>No market data available. Ask general market questions or specify a market.</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <Card className="p-3 bg-muted/20 border-dashed border border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BrainCircuit className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium text-primary">
              {marketData.symbol} Market Data
            </span>
            <Badge variant="outline" className="ml-2 text-xs">
              Quantum-Enhanced
            </Badge>
          </div>
          <CollapsibleTrigger asChild>
            <button className="rounded-full p-1 hover:bg-muted">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Current Price:</div>
              <div className="font-medium">${marketData.price.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">24h Change:</div>
              <div className={`font-medium ${marketData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">24h High:</div>
              <div className="font-medium">${marketData.high24h?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">24h Low:</div>
              <div className="font-medium">${marketData.low24h?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Volume:</div>
              <div className="font-medium">{marketData.volume?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Market Cap:</div>
              <div className="font-medium">${marketData.marketCap?.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
            <p>
              The AI uses quantum-inspired QUBO techniques to analyze and optimize portfolio decisions. 
              This approach can handle up to 16 different assets at once while balancing returns, risk, and budget constraints.
            </p>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
