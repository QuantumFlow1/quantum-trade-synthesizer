
import React from 'react';
import { Card } from '@/components/ui/card';
import { MarketData } from '../types';
import { BrainCircuit, ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketDataSummaryProps {
  marketData?: MarketData;
}

const QuboFormulationDisplay = () => {
  return (
    <div className="mt-4 pt-3 border-t border-muted text-xs">
      <h4 className="font-semibold mb-1 flex items-center">
        <Calculator className="h-3 w-3 mr-1" />
        QUBO Formulation
      </h4>
      <div className="font-mono bg-black/10 dark:bg-white/5 rounded p-2 text-[10px] overflow-x-auto">
        <code className="whitespace-pre-wrap">
          {`f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ

Where:
- xᵢ ∈ {0,1} (binary decision variables) 
- b = budget constraint
- pᵢ = asset price
- rᵢ = expected return
- θ₁, θ₂, θ₃ = weights for returns, budget, diversification`}
        </code>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        This QUBO formulation optimizes portfolios by balancing returns, budget constraints, and 
        diversification, making it suitable for quantum computing approaches.
      </p>
    </div>
  );
};

export function MarketDataSummary({ marketData }: MarketDataSummaryProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("market");

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="market" className="text-xs py-1">Market Data</TabsTrigger>
              <TabsTrigger value="qubo" className="text-xs py-1">QUBO Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market">
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
            </TabsContent>
            
            <TabsContent value="qubo">
              <QuboFormulationDisplay />
              
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-primary/5 p-2 rounded">
                  <div className="font-medium mb-1">Expected Returns</div>
                  <div className="text-muted-foreground">-θ₁∑ᵢxᵢrᵢ</div>
                  <div className="mt-1 text-[10px]">Maximizes portfolio return</div>
                </div>
                <div className="bg-primary/5 p-2 rounded">
                  <div className="font-medium mb-1">Budget Constraint</div>
                  <div className="text-muted-foreground">θ₂(∑ᵢxᵢpᵢ - b)²</div>
                  <div className="mt-1 text-[10px]">Ensures budget compliance</div>
                </div>
                <div className="bg-primary/5 p-2 rounded">
                  <div className="font-medium mb-1">Risk Diversification</div>
                  <div className="text-muted-foreground">θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ</div>
                  <div className="mt-1 text-[10px]">Manages portfolio risk</div>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
                <p>
                  This quantum-inspired approach uses binary decision variables (buy/don't buy) and can be
                  solved using quantum annealing on hardware like D-Wave's quantum computers.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
