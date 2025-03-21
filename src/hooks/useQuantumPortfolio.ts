
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
  
  // Fetch crypto prices using our optimized hook with priority set to accuracy
  const { data: cryptoPrices, isLoading: pricesLoading, error: pricesError } = 
    useCryptoPrices({ symbols, priority: 'accuracy', refetchInterval: 30000 });
  
  // Format crypto data for quantum optimization
  const formatAssetsForOptimization = (prices: CryptoPrice[]): PortfolioAsset[] => {
    return prices.map(crypto => ({
      symbol: crypto.symbol,
      price: crypto.price,
      expectedReturn: crypto.change24h / 100, // Convert percentage to decimal
    }));
  };
  
  // Log if we have price data
  if (cryptoPrices && cryptoPrices.length > 0) {
    console.log("Crypto prices available for portfolio optimization:", 
      cryptoPrices.map(c => `${c.symbol}: $${c.price.toFixed(2)}`));
  }
  
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
      
      // Validate asset data before sending to edge function
      assets.forEach(asset => {
        if (!asset.symbol || typeof asset.price !== 'number' || typeof asset.expectedReturn !== 'number') {
          throw new Error(`Invalid asset data: ${JSON.stringify(asset)}`);
        }
        
        if (asset.price <= 0) {
          throw new Error(`Asset price must be positive: ${asset.symbol} has price ${asset.price}`);
        }
      });
      
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
        throw new Error(data?.error || "Failed to optimize portfolio");
      }
      
      // Process results
      const { solution, qubo } = data;
      
      // Validate solution
      if (!solution || !Array.isArray(solution.selectedAssets)) {
        throw new Error("Invalid solution structure returned from optimization");
      }
      
      // Compute allocations and quantities for selected assets
      const portfolio = assets.map((asset, index) => ({
        ...asset,
        allocation: solution.binaryVector[index] === 1 ? 
          (asset.price / solution.totalCost) * solution.totalCost : 0,
        quantity: solution.binaryVector[index] === 1 ? 
          1 : 0 // We're using binary decisions, so quantity is either 0 or 1
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
  const { data: optimizationResults, refetch: reoptimize, isError: optimizationError } = useQuery({
    queryKey: ['quantum-portfolio', symbols.join(','), budget, JSON.stringify(weights)],
    queryFn: () => optimizePortfolio(),
    enabled: !pricesLoading && cryptoPrices !== undefined && cryptoPrices.length > 0,
    staleTime: 5 * 60 * 1000, // Consider results stale after 5 minutes
    retry: 2, // Only retry twice in case of errors
  });
  
  return {
    cryptoPrices,
    pricesLoading,
    pricesError,
    optimizationResults,
    optimizationError,
    isOptimizing,
    optimizePortfolio,
    reoptimize
  };
}
