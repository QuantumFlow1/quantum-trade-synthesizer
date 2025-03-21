
import React, { useState } from 'react';
import { useQuantumPortfolio } from '@/hooks/useQuantumPortfolio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PortfolioOptimizationResults } from './PortfolioOptimizationResults';
import { Loader2, RefreshCw } from 'lucide-react';

interface QuantumPortfolioOptimizerProps {
  defaultBudget?: number;
  defaultSymbols?: string[];
}

export const QuantumPortfolioOptimizer: React.FC<QuantumPortfolioOptimizerProps> = ({
  defaultBudget = 100000,
  defaultSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']
}) => {
  const [budget, setBudget] = useState(defaultBudget);
  const [returnWeight, setReturnWeight] = useState(0.5);
  const [budgetWeight, setBudgetWeight] = useState(0.2);
  const [diversificationWeight, setDiversificationWeight] = useState(0.3);

  // Calculate combined weight sum to ensure it equals 1
  const weightSum = returnWeight + budgetWeight + diversificationWeight;
  const weightsValid = Math.abs(weightSum - 1) < 0.01;

  const {
    cryptoPrices,
    pricesLoading,
    optimizationResults,
    isOptimizing,
    optimizePortfolio,
    reoptimize
  } = useQuantumPortfolio({
    budget,
    weights: {
      returnWeight,
      budgetWeight,
      diversificationWeight
    },
    symbols: defaultSymbols
  });

  const handleOptimize = async () => {
    await optimizePortfolio(budget, {
      returnWeight,
      budgetWeight,
      diversificationWeight
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Quantum Portfolio Optimizer</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reoptimize} 
              disabled={isOptimizing || pricesLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Investment Budget ($)</label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={1000}
                  max={10000000}
                  disabled={isOptimizing}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Return Weight: {returnWeight.toFixed(2)}
                </label>
                <Slider
                  value={[returnWeight]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(values) => setReturnWeight(values[0])}
                  disabled={isOptimizing}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Budget Weight: {budgetWeight.toFixed(2)}
                </label>
                <Slider
                  value={[budgetWeight]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(values) => setBudgetWeight(values[0])}
                  disabled={isOptimizing}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Diversification Weight: {diversificationWeight.toFixed(2)}
                </label>
                <Slider
                  value={[diversificationWeight]}
                  min={0}
                  max={1}
                  step={0.05}
                  onValueChange={(values) => setDiversificationWeight(values[0])}
                  disabled={isOptimizing}
                />
              </div>

              {!weightsValid && (
                <div className="text-red-500 text-sm">
                  Weights must sum to 1. Current sum: {weightSum.toFixed(2)}
                </div>
              )}

              <Button 
                onClick={handleOptimize} 
                disabled={isOptimizing || pricesLoading || !weightsValid}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  'Optimize Portfolio'
                )}
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Available Assets</h3>
              {pricesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {cryptoPrices?.map((crypto) => (
                    <Card key={crypto.symbol} className="p-3">
                      <div className="font-medium">{crypto.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        ${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}% (24h)
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {optimizationResults && (
        <PortfolioOptimizationResults 
          portfolio={optimizationResults.portfolio}
          metrics={optimizationResults.metrics}
          budget={budget}
        />
      )}
    </div>
  );
};
