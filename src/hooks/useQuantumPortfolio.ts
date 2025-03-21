
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { CryptoPrice, useCryptoPrices } from './use-crypto-prices';

interface PortfolioAsset {
  symbol: string;
  price: number;
  expectedReturn: number;
  allocation?: number;
  quantity?: number;
}

interface PortfolioWeights {
  returnWeight: number;
  budgetWeight: number;
  diversificationWeight: number;
}

interface PortfolioSolution {
  selectedAssets: string[];
  binaryVector: number[];
  objectiveValue: number;
  totalCost: number;
  expectedReturn: number;
}

interface UseQuantumPortfolioOptions {
  budget?: number;
  weights?: PortfolioWeights;
  symbols?: string[];
}

export function useQuantumPortfolio({
  budget = 100000,
  weights = {
    returnWeight: 0.5,
    budgetWeight: 0.2,
    diversificationWeight: 0.3
  },
  symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']
}: UseQuantumPortfolioOptions = {}) {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  // Fetch crypto prices using our optimized hook
  const { data: cryptoPrices, isLoading: pricesLoading, error: pricesError } = 
    useCryptoPrices({ symbols, priority: 'accuracy' });
  
  // Format crypto data for quantum optimization
  const formatAssetsForOptimization = (prices: CryptoPrice[]): PortfolioAsset[] => {
    return prices.map(crypto => ({
      symbol: crypto.symbol,
      price: crypto.price,
      expectedReturn: crypto.change24h / 100, // Convert percentage to decimal
    }));
  };
  
  // Function to run portfolio optimization
  const optimizePortfolio = async (customBudget?: number, customWeights?: PortfolioWeights) => {
    if (!cryptoPrices || cryptoPrices.length === 0) {
      toast({
        title: "No price data available",
        description: "Please try again when price data is loaded",
        variant: "destructive",
      });
      return null;
    }
    
    setIsOptimizing(true);
    
    try {
      const assets = formatAssetsForOptimization(cryptoPrices);
      
      console.log("Optimizing portfolio with assets:", assets);
      console.log("Budget:", customBudget || budget);
      console.log("Weights:", customWeights || weights);
      
      const { data, error } = await supabase.functions.invoke('quantum-portfolio', {
        body: { 
          assets,
          budget: customBudget || budget,
          weights: customWeights || weights
        }
      });
      
      if (error) {
        console.error("Error optimizing portfolio:", error);
        throw new Error(error.message);
      }
      
      if (!data || !data.success) {
        console.error("Invalid response from quantum-portfolio function:", data);
        throw new Error("Failed to optimize portfolio");
      }
      
      // Process results
      const { solution, qubo } = data;
      
      // Compute allocations and quantities for selected assets
      const portfolio = assets.map((asset, index) => ({
        ...asset,
        allocation: solution.binaryVector[index] === 1 ? 
          (asset.price / solution.totalCost) * solution.totalCost : 0,
        quantity: solution.binaryVector[index] === 1 ? 
          solution.totalCost / asset.price : 0
      })).filter(asset => asset.allocation > 0);
      
      console.log("Optimized portfolio:", portfolio);
      
      return {
        portfolio,
        solution,
        qubo,
        metrics: {
          expectedReturn: solution.expectedReturn,
          totalCost: solution.totalCost,
          objectiveValue: solution.objectiveValue
        }
      };
    } catch (error) {
      console.error("Portfolio optimization error:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Could not optimize portfolio",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };
  
  // Query to auto-run the optimization when prices are available
  const { data: optimizationResults, refetch: reoptimize } = useQuery({
    queryKey: ['quantum-portfolio', symbols.join(','), budget, JSON.stringify(weights)],
    queryFn: () => optimizePortfolio(),
    enabled: !pricesLoading && cryptoPrices !== undefined && cryptoPrices.length > 0,
    staleTime: 5 * 60 * 1000, // Consider results stale after 5 minutes
  });
  
  return {
    cryptoPrices,
    pricesLoading,
    pricesError,
    optimizationResults,
    isOptimizing,
    optimizePortfolio,
    reoptimize
  };
}
