
import React from 'react';
import { useQuantumPortfolio } from '@/hooks/useQuantumPortfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AtomIcon, BarChart, LineChart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface QuantumPortfolioDisplayProps {
  budget?: number;
  symbols?: string[];
}

export function QuantumPortfolioDisplay({ 
  budget = 100000,
  symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']
}: QuantumPortfolioDisplayProps) {
  const { 
    cryptoPrices, 
    pricesLoading, 
    optimizationResults, 
    isOptimizing, 
    reoptimize 
  } = useQuantumPortfolio({
    budget,
    symbols
  });
  
  const handleRefresh = () => {
    reoptimize();
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AtomIcon className="mr-2 h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">Quantum Portfolio Optimization</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isOptimizing || pricesLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {pricesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : !cryptoPrices ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Could not load price data</p>
          </div>
        ) : (
          <>
            {/* Price Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
              {cryptoPrices.map((crypto) => (
                <div key={crypto.symbol} className="bg-muted/50 rounded-md p-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-sm">{formatCurrency(crypto.price)}</div>
                </div>
              ))}
            </div>
            
            {/* Optimization Results */}
            {isOptimizing ? (
              <div className="text-center py-4">
                <AtomIcon className="h-8 w-8 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-sm text-muted-foreground">Running quantum optimization algorithm...</p>
              </div>
            ) : optimizationResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Optimal Portfolio</h4>
                    <div className="space-y-1">
                      {optimizationResults.portfolio.map((asset) => (
                        <div key={asset.symbol} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <LineChart className="h-4 w-4 mr-1.5 text-primary/60" />
                            <span>{asset.symbol}</span>
                          </div>
                          <div className="font-medium">{formatCurrency(asset.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Portfolio Metrics</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total Cost:</span>
                        <span className="font-medium">{formatCurrency(optimizationResults.metrics.totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expected Return:</span>
                        <span className={`font-medium ${optimizationResults.metrics.expectedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(optimizationResults.metrics.expectedReturn)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilization:</span>
                        <span className="font-medium">
                          {formatPercentage(optimizationResults.metrics.totalCost / budget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center mb-2">
                    <BarChart className="h-4 w-4 mr-1.5" />
                    <h4 className="text-sm font-medium">Asset Allocation</h4>
                  </div>
                  <div className="space-y-2">
                    {optimizationResults.portfolio.map((asset) => (
                      <div key={asset.symbol} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{asset.symbol}</span>
                          <span>{formatPercentage(asset.allocation || 0)}</span>
                        </div>
                        <Progress value={((asset.allocation || 0) * 100)} max={100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                  <p>
                    This portfolio was optimized using a quantum-inspired algorithm with {symbols.length} assets
                    and a budget of {formatCurrency(budget)}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No optimization results available</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh} 
                  className="mt-2"
                >
                  Run Optimization
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
