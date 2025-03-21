
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Asset {
  symbol: string;
  price: number;
  expectedReturn: number;
}

interface PortfolioParams {
  assets: Asset[];
  budget: number;
  weights: {
    returnWeight: number;
    budgetWeight: number;
    diversificationWeight: number;
  };
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

serve(async (req) => {
  console.log(`quantum-portfolio function started at ${new Date().toISOString()}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    console.log("Received portfolio optimization request:", JSON.stringify(params));
    
    // Extract parameters or use defaults
    const { assets, budget = 100000, weights } = params;
    
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      throw new Error("Assets array is required and must not be empty");
    }
    
    // Use provided weights or defaults
    const optimizationWeights = weights || {
      returnWeight: 0.5,
      budgetWeight: 0.2,
      diversificationWeight: 0.3
    };
    
    // Check that weights sum to approximately 1
    const weightSum = optimizationWeights.returnWeight + 
                       optimizationWeights.budgetWeight + 
                       optimizationWeights.diversificationWeight;
    
    if (Math.abs(weightSum - 1) > 0.01) {
      console.warn(`Portfolio weights don't sum to 1. Current sum: ${weightSum}`);
    }
    
    // Validate asset data
    assets.forEach((asset, index) => {
      if (!asset.symbol || typeof asset.price !== 'number' || typeof asset.expectedReturn !== 'number') {
        throw new Error(`Invalid asset data at index ${index}: ${JSON.stringify(asset)}`);
      }
      
      if (asset.price <= 0) {
        throw new Error(`Asset price must be positive: ${asset.symbol} has price ${asset.price}`);
      }
      
      // Log each asset for debugging
      console.log(`Asset ${index}: Symbol=${asset.symbol}, Price=${asset.price}, ExpectedReturn=${asset.expectedReturn}`);
    });
    
    // Generate QUBO matrix
    console.log(`Generating QUBO matrix for ${assets.length} assets with budget $${budget}`);
    const qubo = generateQUBOMatrix({
      assets,
      budget,
      weights: optimizationWeights
    });
    
    // Solve using classical method
    console.log("Solving portfolio optimization problem...");
    const solution = solveQUBOClassical(qubo, budget, assets);
    
    console.log(`Solution found, selecting ${solution.selectedAssets.length} assets`);
    console.log("Selected assets:", solution.selectedAssets);
    
    return new Response(
      JSON.stringify({
        success: true,
        qubo,
        solution,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error("Error in quantum-portfolio:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

/**
 * Generates a QUBO matrix for portfolio optimization
 */
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
  
  // Generate simple correlation matrix
  const correlationMatrix = generateCorrelationMatrix(assets);

  // IMPORTANT: Normalize prices by the budget to avoid extreme values in QUBO
  const normalizedPrices = prices.map(p => p / budget);
  
  // Log normalized prices for debugging
  console.log("Normalized prices:", normalizedPrices);
  
  // Populate QUBO matrix
  // 1. Expected Returns component (linear terms on diagonal)
  for (let i = 0; i < n; i++) {
    Q[i][i] -= returnWeight * returns[i];
  }
  
  // 2. Budget constraint component (quadratic terms)
  // For quadratic terms x_i * x_j
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
  // Scale down the correlation contribution to avoid it dominating
  const correlationScale = 0.1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Q[i][j] += diversificationWeight * correlationMatrix[i][j] * correlationScale;
    }
  }

  // Check for NaN or Infinity values in the QUBO matrix
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!isFinite(Q[i][j])) {
        console.error(`QUBO matrix contains NaN or Infinity at position [${i}][${j}]: ${Q[i][j]}`);
        // Replace with a safe value
        Q[i][j] = 0;
      }
    }
  }

  // Log a sample of the QUBO matrix for debugging
  if (n <= 5) {
    console.log("Full QUBO matrix:");
    console.log(Q);
  } else {
    console.log("QUBO matrix (first 3x3 elements):");
    for (let i = 0; i < 3; i++) {
      console.log(Q[i].slice(0, 3));
    }
  }
  
  return {
    matrix: Q,
    symbols: assets.map(a => a.symbol),
    expectedValue: constantTerm
  };
}

/**
 * Generate a simple correlation matrix based on price trends
 */
function generateCorrelationMatrix(assets: Asset[]): number[][] {
  const n = assets.length;
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Set diagonal to 1 (asset perfectly correlated with itself)
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
  }
  
  // Simple correlation based on return signs (positive/negative)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Assets with same return direction are more correlated
      const correlation = Math.sign(assets[i].expectedReturn) === Math.sign(assets[j].expectedReturn) ? 
        0.5 : -0.2;
      matrix[i][j] = correlation;
      matrix[j][i] = correlation; // Matrix is symmetric
    }
  }
  
  return matrix;
}

/**
 * Solve QUBO problem using classical methods (greedy approach)
 */
function solveQUBOClassical(qubo: QUBOMatrix, budget: number, assets: Asset[]): PortfolioSolution {
  const n = assets.length;
  const symbols = qubo.symbols;
  const prices = assets.map(a => a.price);
  const returns = assets.map(a => a.expectedReturn);
  
  try {
    // For demonstration, use a greedy approach based on return-to-price ratio
    const valueRatios = returns.map((ret, i) => ({
      index: i,
      ratio: ret / prices[i],
      price: prices[i]
    }));
    
    // Sort by return-to-price ratio in descending order
    valueRatios.sort((a, b) => b.ratio - a.ratio);
    
    // Greedily select assets up to budget
    const selected = new Array(n).fill(0);
    let totalCost = 0;
    let expectedReturn = 0;
    
    for (const item of valueRatios) {
      if (totalCost + item.price <= budget) {
        selected[item.index] = 1;
        totalCost += item.price;
        expectedReturn += returns[item.index];
      }
    }
    
    // Calculate objective value based on QUBO formulation
    let objectiveValue = qubo.expectedValue;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        objectiveValue += qubo.matrix[i][j] * selected[i] * selected[j];
      }
    }

    // Check if objective value is valid
    if (!isFinite(objectiveValue)) {
      console.warn("Invalid objective value detected, defaulting to 0");
      objectiveValue = 0;
    }
    
    return {
      selectedAssets: symbols.filter((_, i) => selected[i] === 1),
      binaryVector: selected,
      objectiveValue,
      totalCost,
      expectedReturn
    };
  } catch (error) {
    console.error("Error in solveQUBOClassical:", error);
    
    // Provide a fallback solution when the solver fails
    return {
      selectedAssets: [],
      binaryVector: new Array(n).fill(0),
      objectiveValue: 0,
      totalCost: 0,
      expectedReturn: 0
    };
  }
}
