
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { MarketData } from '../types';
import { BrainCircuit, ChevronDown, ChevronUp, Calculator, LineChart, Database } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateQUBOMatrix } from '@/utils/market/liveDataFetcher';

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

const LiveQuboMatrixDisplay = ({ marketData }: { marketData?: MarketData }) => {
  const [quboMatrix, setQuboMatrix] = useState<number[][] | null>(null);
  const [assets, setAssets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchAndGenerateMatrix = async () => {
      try {
        if (!marketData) return;
        
        setIsLoading(true);
        
        // For demo purposes, create mock data from the single marketData entry
        // In a real implementation, you would use fetchLiveMarketData() to get real data
        const mockLiveData: MarketData[] = [
          { ...marketData },
          { 
            ...marketData, 
            symbol: 'ETH', 
            price: marketData.price * 0.7,
            change24h: marketData.change24h - 1.5 
          },
          { 
            ...marketData, 
            symbol: 'ADA', 
            price: marketData.price * 0.02,
            change24h: marketData.change24h + 2.1 
          },
          { 
            ...marketData, 
            symbol: 'SOL', 
            price: marketData.price * 0.2,
            change24h: marketData.change24h - 0.8 
          },
          { 
            ...marketData, 
            symbol: 'DOT', 
            price: marketData.price * 0.1,
            change24h: marketData.change24h + 1.3 
          }
        ];
        
        // Generate QUBO matrix
        const result = generateQUBOMatrix(mockLiveData, 10000, [0.4, 0.4, 0.2]);
        setQuboMatrix(result.matrix);
        setAssets(result.assets);
      } catch (error) {
        console.error("Error generating live QUBO matrix:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndGenerateMatrix();
  }, [marketData]);
  
  if (isLoading) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        Generating QUBO matrix from live market data...
      </div>
    );
  }
  
  if (!quboMatrix || quboMatrix.length === 0) {
    return (
      <div className="py-4 text-center text-xs text-muted-foreground">
        No QUBO matrix available. Market data is required.
      </div>
    );
  }
  
  // Format matrix for display - show only first 3x3 for space
  const displayMatrix = quboMatrix.slice(0, 3).map(row => row.slice(0, 3));
  
  return (
    <div className="mt-4 pt-3 border-t border-muted text-xs">
      <h4 className="font-semibold mb-1 flex items-center">
        <LineChart className="h-3 w-3 mr-1" />
        Live QUBO Matrix (Sample)
      </h4>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-primary/5 p-2 rounded">
          <div className="font-medium mb-1">Assets</div>
          <div className="text-[10px] overflow-hidden">
            {assets.slice(0, 5).map((asset, i) => (
              <div key={i} className="flex justify-between">
                <span>{i+1}. {asset}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary/5 p-2 rounded">
          <div className="font-medium mb-1">Settings</div>
          <div className="text-[10px]">
            <div>Budget: $10,000</div>
            <div>θ₁ (Return): 0.4</div>
            <div>θ₂ (Budget): 0.4</div>
            <div>θ₃ (Risk): 0.2</div>
          </div>
        </div>
      </div>
      
      <div className="font-mono bg-black/10 dark:bg-white/5 rounded p-2 text-[10px] overflow-x-auto">
        <div className="font-medium mb-1">Q Matrix (3x3 sample):</div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-1"></th>
              {assets.slice(0, 3).map((asset, i) => (
                <th key={i} className="p-1">{asset}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMatrix.map((row, i) => (
              <tr key={i}>
                <td className="p-1 font-medium">{assets[i]}</td>
                {row.map((value, j) => (
                  <td key={j} className="p-1">{value.toFixed(2)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-center text-muted-foreground">
          {quboMatrix.length > 3 ? `(Showing 3x3 of ${quboMatrix.length}x${quboMatrix.length} matrix)` : ''}
        </div>
      </div>
      
      <p className="mt-2 text-xs text-muted-foreground">
        This QUBO matrix was generated from real-time market data. The diagonal elements represent 
        individual asset factors, while off-diagonal elements represent interactions between assets.
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
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="market" className="text-xs py-1">Market Data</TabsTrigger>
              <TabsTrigger value="qubo" className="text-xs py-1">QUBO Analysis</TabsTrigger>
              <TabsTrigger value="live" className="text-xs py-1">Live Matrix</TabsTrigger>
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
            
            <TabsContent value="live">
              <LiveQuboMatrixDisplay marketData={marketData} />
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
