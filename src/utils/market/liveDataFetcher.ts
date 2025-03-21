
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
 * Optimizes a portfolio using the top 3 major cryptocurrencies
 * @param budget The investment budget in USD
 * @param riskLevel Risk profile: 'low' (risk-averse), 'medium' (balanced), 'high' (aggressive)
 * @returns Optimized portfolio allocation and QUBO details
 */
export async function optimizeMajorCryptoPortfolio(
  budget: number = 10000, 
  riskLevel: 'low' | 'medium' | 'high' = 'medium'
): Promise<{
  allocation: {symbol: string, amount: number, percentage: number}[],
  quboMatrix: number[][],
  quboSolution: number[], 
  expectedReturn: number,
  riskScore: number,
  diversificationScore: number
}> {
  try {
    console.log(`Optimizing top 3 crypto portfolio with budget $${budget} and ${riskLevel} risk profile`);
    
    // Fetch all market data
    const allMarketData = await fetchLiveMarketData();
    
    // Filter to get only major cryptocurrencies (top 3 by market cap)
    const majorCryptos = allMarketData
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, 3);
    
    if (majorCryptos.length < 3) {
      console.error("Not enough major cryptocurrencies found in market data");
      throw new Error("Insufficient market data for optimization");
    }
    
    console.log("Optimizing portfolio for:", majorCryptos.map(c => c.symbol).join(", "));
    
    // Adjust weights based on risk level
    let weights: [number, number, number];
    switch (riskLevel) {
      case 'low':
        weights = [0.2, 0.6, 0.2]; // Lower return weight, higher budget constraint
        break;
      case 'high':
        weights = [0.6, 0.2, 0.2]; // Higher return weight, lower budget constraint
        break;
      case 'medium':
      default:
        weights = [0.4, 0.4, 0.2]; // Balanced approach
        break;
    }
    
    // Generate QUBO matrix
    const { matrix, assets } = generateQUBOMatrix(majorCryptos, budget, weights);
    
    // Simulate solving the QUBO problem (in a real quantum system, this would be sent to a quantum solver)
    // For this demo, we'll use a simplified classical approximation
    const solution = simulateSolveQUBO(matrix, majorCryptos, budget);
    
    // Calculate allocation based on solution
    const allocation = assets.map((symbol, i) => {
      const crypto = majorCryptos.find(c => c.symbol === symbol);
      const amount = solution[i] * budget / (crypto?.price || 1);
      return {
        symbol,
        amount,
        percentage: solution[i] * 100
      };
    });
    
    // Calculate portfolio metrics
    const totalInvestment = allocation.reduce((sum, item) => {
      const crypto = majorCryptos.find(c => c.symbol === item.symbol);
      return sum + (item.amount * (crypto?.price || 0));
    }, 0);
    
    const expectedReturn = allocation.reduce((sum, item) => {
      const crypto = majorCryptos.find(c => c.symbol === item.symbol);
      return sum + (item.percentage / 100 * (crypto?.change24h || 0));
    }, 0);
    
    // Generate a risk score (0-100)
    const volatilityScore = allocation.reduce((sum, item) => {
      const crypto = majorCryptos.find(c => c.symbol === item.symbol);
      const volatility = Math.abs(crypto?.change24h || 0);
      return sum + (item.percentage / 100 * volatility);
    }, 0);
    
    const riskScore = Math.min(100, Math.max(0, volatilityScore * 5));
    
    // Diversification score based on Herfindahl-Hirschman Index (HHI)
    const hhi = allocation.reduce((sum, item) => {
      return sum + Math.pow(item.percentage / 100, 2);
    }, 0);
    const diversificationScore = Math.round((1 - hhi) * 100);
    
    return {
      allocation,
      quboMatrix: matrix,
      quboSolution: solution,
      expectedReturn,
      riskScore,
      diversificationScore
    };
  } catch (error) {
    console.error("Error optimizing major crypto portfolio:", error);
    throw error;
  }
}

/**
 * Simple classical approximation of solving a QUBO problem
 * In a real system, this would be replaced by a call to a quantum solver
 */
function simulateSolveQUBO(matrix: number[][], marketData: MarketData[], budget: number): number[] {
  const n = matrix.length;
  
  // For simplicity, we'll use a greedy approach for this demo
  // Calculate the expected return to risk ratio for each asset
  const scores = marketData.map((asset, i) => {
    const expectedReturn = asset.change24h || 0;
    const risk = Math.abs(expectedReturn);
    const score = risk > 0 ? expectedReturn / risk : 0;
    return { index: i, score };
  });
  
  // Sort by score
  scores.sort((a, b) => b.score - a.score);
  
  // Allocate budget based on scores
  const solution = new Array(n).fill(0);
  let remainingBudget = budget;
  let totalScore = scores.reduce((sum, item) => sum + Math.max(0.1, item.score), 0);
  
  // Assign proportional to score, ensuring we satisfy budget constraint
  for (const item of scores) {
    const normalizedScore = Math.max(0.1, item.score) / totalScore;
    solution[item.index] = normalizedScore;
  }
  
  // Normalize to ensure sum = 1
  const totalAllocation = solution.reduce((sum, val) => sum + val, 0);
  return solution.map(val => val / totalAllocation);
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
