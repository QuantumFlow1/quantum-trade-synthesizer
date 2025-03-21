
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface Asset {
  symbol: string;
  price: number;
  expectedReturn: number;
}

interface PortfolioWeights {
  returnWeight: number;
  budgetWeight: number;
  diversificationWeight: number;
}

interface PortfolioParams {
  assets: Asset[];
  budget: number;
  weights: PortfolioWeights;
}

interface QUBOMatrix {
  matrix: number[][];
  symbols: string[];
  expectedValue: number;
}

interface PortfolioSolution {
  selectedAssets: string[];
  binaryVector: number[];
  objectiveValue: number;
  totalCost: number;
  expectedReturn: number;
}

// Generate a QUBO matrix for portfolio optimization
function generateQUBOMatrix(params: PortfolioParams): QUBOMatrix {
  const { assets, budget, weights } = params;
  const n = assets.length;
  
  // Initialize Q matrix with zeros
  const Q: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Extract weights
  const { returnWeight, budgetWeight, diversificationWeight } = weights;
  
  // Extract asset prices and returns
  const prices = assets.map(a => a.price);
  const returns = assets.map(a => a.expectedReturn);
  
  // Generate correlation matrix with diagonal 1 and off-diagonal 0.2
  const correlationMatrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0.2));
  for (let i = 0; i < n; i++) {
    correlationMatrix[i][i] = 1;
  }

  // Normalize prices by the budget to avoid extreme values in QUBO
  const normalizedPrices = prices.map(p => p / budget);
  
  // Populate QUBO matrix
  // 1. Expected Returns component (linear terms on diagonal)
  for (let i = 0; i < n; i++) {
    Q[i][i] -= returnWeight * returns[i];
  }
  
  // 2. Budget constraint component (quadratic terms)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Q[i][j] += budgetWeight * normalizedPrices[i] * normalizedPrices[j];
    }
    // Linear terms for budget constraint: -2 * θ₂ * (p_i/b) (for x_i)
    Q[i][i] -= 2 * budgetWeight * normalizedPrices[i];
  }
  
  // Add constant term to expected value (not in matrix)
  const constantTerm = budgetWeight; // This is b²/b² = 1 after normalization
  
  // 3. Diversification component using correlation matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Q[i][j] += diversificationWeight * correlationMatrix[i][j] * 0.1; // Scale to keep values reasonable
    }
  }

  return {
    matrix: Q,
    symbols: assets.map(a => a.symbol),
    expectedValue: constantTerm
  };
}

// Solve QUBO problem using a greedy classical approach
function solveQUBOClassical(qubo: QUBOMatrix, budget: number, assets: Asset[]): PortfolioSolution {
  const n = assets.length;
  const symbols = qubo.symbols;
  const prices = assets.map(a => a.price);
  const returns = assets.map(a => a.expectedReturn);
  
  // Use a greedy approach based on return-to-price ratio
  const valueRatios = returns.map((ret, i) => ({
    index: i,
    ratio: ret / prices[i],
    price: prices[i],
    symbol: symbols[i]
  }));
  
  // Sort by return-to-price ratio in descending order
  valueRatios.sort((a, b) => b.ratio - a.ratio);
  
  // Greedily select assets up to budget
  const selected = new Array(n).fill(0);
  let totalCost = 0;
  let expectedReturn = 0;
  const selectedAssets: string[] = [];
  
  for (const item of valueRatios) {
    if (totalCost + item.price <= budget) {
      selected[item.index] = 1;
      totalCost += item.price;
      expectedReturn += returns[item.index];
      selectedAssets.push(item.symbol);
    }
  }
  
  // Calculate objective value based on QUBO formulation
  let objectiveValue = qubo.expectedValue;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      objectiveValue += qubo.matrix[i][j] * selected[i] * selected[j];
    }
  }
  
  return {
    selectedAssets,
    binaryVector: selected,
    objectiveValue,
    totalCost,
    expectedReturn
  };
}

serve(async (req) => {
  try {
    // Parse the request body
    const { assets, budget, weights } = await req.json() as PortfolioParams;
    
    // Validate inputs
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid assets data" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!budget || budget <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid budget value" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Generate QUBO matrix
    const qubo = generateQUBOMatrix({ assets, budget, weights });
    
    // Solve the QUBO problem
    const solution = solveQUBOClassical(qubo, budget, assets);
    
    // Return the result
    return new Response(
      JSON.stringify({ 
        success: true, 
        qubo, 
        solution
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in quantum-portfolio function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred during portfolio optimization" 
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
