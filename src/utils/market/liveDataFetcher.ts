
import { MarketData } from "@/components/market/types";
import { supabase } from "@/lib/supabase";

/**
 * Fetches real-time market data from the API for QUBO calculations
 */
export async function fetchLiveMarketData(): Promise<MarketData[]> {
  try {
    console.log("Fetching real-time market data for QUBO calculations");
    
    const { data, error } = await supabase.functions.invoke('real-crypto-data');
    
    if (error) {
      console.error("Error fetching real-time market data:", error);
      throw new Error(`Failed to fetch real-time market data: ${error.message}`);
    }
    
    if (!data || !data.success || !Array.isArray(data.data)) {
      console.error("Invalid data format received from real-crypto-data:", data);
      throw new Error("Invalid data format received from server");
    }
    
    console.log(`Successfully fetched ${data.data.length} real market data points for QUBO calculations`);
    return data.data;
  } catch (error) {
    console.error("Error in fetchLiveMarketData:", error);
    throw error;
  }
}

/**
 * Generates a QUBO matrix from market data
 * @param marketData Array of market data points
 * @param budget User's budget constraint
 * @param weights Weights for the QUBO objective function components: [expectedReturn, budgetConstraint, diversification]
 */
export function generateQUBOMatrix(
  marketData: MarketData[], 
  budget: number = 10000, 
  weights: [number, number, number] = [0.4, 0.4, 0.2]
): { matrix: number[][], assets: string[] } {
  if (!marketData || marketData.length === 0) {
    throw new Error("No market data available for QUBO matrix generation");
  }
  
  console.log(`Generating QUBO matrix for ${marketData.length} assets with budget $${budget}`);
  
  // Extract weights
  const [theta1, theta2, theta3] = weights;
  
  // Prepare asset data
  const assets = marketData.map(asset => asset.symbol);
  const prices = marketData.map(asset => asset.price);
  
  // Generate expected returns (using 24h change as a simple proxy)
  const expectedReturns = marketData.map(asset => asset.change24h / 100);
  
  // Create empty QUBO matrix (n x n)
  const n = marketData.length;
  const Q: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Generate simple covariance matrix (in a real system, this would use historical data)
  // For demonstration, we'll use a simplified approach
  const covariance: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Fill diagonal of covariance with volatility estimate (using price as proxy)
  for (let i = 0; i < n; i++) {
    covariance[i][i] = Math.pow(prices[i] / 1000, 2); // Simple volatility estimate
  }
  
  // Fill off-diagonal with simplified correlation
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Simplified correlation based on price movement direction
      const correlation = (Math.sign(expectedReturns[i]) === Math.sign(expectedReturns[j])) ? 0.5 : -0.3;
      covariance[i][j] = correlation * Math.sqrt(covariance[i][i] * covariance[j][j]);
      covariance[j][i] = covariance[i][j]; // Ensure symmetry
    }
  }
  
  // Fill the QUBO matrix
  for (let i = 0; i < n; i++) {
    // Diagonal elements: expected return contribution + budget constraint + own variance
    Q[i][i] = -theta1 * expectedReturns[i] + theta2 * Math.pow(prices[i], 2) + theta3 * covariance[i][i];
    
    // Also account for the linear term in budget constraint: -2*theta2*b*p[i]
    Q[i][i] -= 2 * theta2 * budget * prices[i];
    
    // Fill off-diagonal elements: budget constraint interaction + covariance
    for (let j = i + 1; j < n; j++) {
      Q[i][j] = 2 * theta2 * prices[i] * prices[j] + theta3 * covariance[i][j];
      Q[j][i] = Q[i][j]; // Ensure symmetry
    }
  }
  
  console.log("QUBO matrix generation complete");
  
  return {
    matrix: Q,
    assets: assets
  };
}
