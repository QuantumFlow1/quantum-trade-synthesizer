
/**
 * QUBO (Quadratic Unconstrained Binary Optimization) Utilities
 * This module provides functions for generating and solving QUBO problems
 * for portfolio optimization using quantum-inspired methods.
 */

/**
 * Asset representation for portfolio optimization
 */
export interface Asset {
  symbol: string;
  price: number;
  expectedReturn: number;
  historicalPrices?: number[];
}

/**
 * QUBO Matrix interface - represents Q matrix in QUBO formulation
 */
export interface QUBOMatrix {
  matrix: number[][];
  symbols: string[];
  expectedValue: number;
}

/**
 * Portfolio optimization weights
 */
export interface PortfolioWeights {
  returnWeight: number;     // θ₁ - weight for expected returns
  budgetWeight: number;     // θ₂ - weight for budget constraint
  diversificationWeight: number; // θ₃ - weight for diversification
}

/**
 * Portfolio optimization parameters
 */
export interface PortfolioParams {
  assets: Asset[];
  budget: number;
  weights: PortfolioWeights;
  correlationMatrix?: number[][];
}

/**
 * Portfolio solution
 */
export interface PortfolioSolution {
  selectedAssets: string[];
  binaryVector: number[];
  objectiveValue: number;
  totalCost: number;
  expectedReturn: number;
}

/**
 * Generates a QUBO matrix for portfolio optimization
 * 
 * The QUBO formulation follows:
 * f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ
 * 
 * Where:
 * - xᵢ ∈ {0,1} are binary variables (1 = buy, 0 = don't buy)
 * - b = budget constraint
 * - pᵢ = asset price
 * - rᵢ = expected return
 * - θ₁, θ₂, θ₃ are weights for expected returns, budget constraint, and diversification
 */
export function generateQUBOMatrix(params: PortfolioParams): QUBOMatrix {
  const { assets, budget, weights } = params;
  const n = assets.length;
  
  // Initialize Q matrix with zeros
  const Q: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Extract weights
  const { returnWeight, budgetWeight, diversificationWeight } = weights;
  
  // Validate weights sum to 1
  const weightSum = returnWeight + budgetWeight + diversificationWeight;
  if (Math.abs(weightSum - 1) > 0.001) {
    console.warn("Portfolio weights should sum to 1. Current sum:", weightSum);
  }

  // Extract asset prices and returns
  const prices = assets.map(a => a.price);
  const returns = assets.map(a => a.expectedReturn);
  
  // Generate correlation matrix if not provided
  const correlationMatrix = params.correlationMatrix || generateCorrelationMatrix(assets);

  // IMPORTANT: Normalize prices by the budget to avoid extreme values in QUBO
  const normalizedPrices = prices.map(p => p / budget);
  
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
  // Normalize the correlation contribution to avoid dominating the QUBO
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Q[i][j] += diversificationWeight * correlationMatrix[i][j] * 0.1; // Scale by 0.1 to keep values reasonable
    }
  }

  // Log the QUBO matrix generated (for debugging purposes)
  console.log(`Generated QUBO matrix for ${n} assets with budget $${budget}`);
  if (n <= 3) { // Only log small matrices to avoid console spam
    console.log("QUBO Matrix:", Q);
    console.log("Normalized Prices:", normalizedPrices);
    console.log("Expected Returns:", returns);
  }

  return {
    matrix: Q,
    symbols: assets.map(a => a.symbol),
    expectedValue: constantTerm
  };
}

/**
 * Generate a simple correlation matrix based on historical price data
 * If no historical data is available, it returns a simple matrix with
 * ones on the diagonal and a low correlation (0.2) elsewhere
 */
function generateCorrelationMatrix(assets: Asset[]): number[][] {
  const n = assets.length;
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0.2));
  
  // Set diagonal to 1 (asset perfectly correlated with itself)
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
  }
  
  // If we have historical price data, calculate actual correlations
  const hasHistoricalData = assets.every(a => a.historicalPrices && a.historicalPrices.length > 0);
  
  if (hasHistoricalData) {
    // Actual correlation calculation would go here
    // For simplicity, we're keeping the default matrix
  }
  
  return matrix;
}

/**
 * Solve QUBO problem using classical methods (greedy approach)
 * Note: This is a simplified solver for demonstration. Real quantum
 * optimization would use quantum annealing or quantum-inspired algorithms.
 */
export function solveQUBOClassical(qubo: QUBOMatrix, budget: number, assets: Asset[]): PortfolioSolution {
  const n = assets.length;
  const symbols = qubo.symbols;
  const prices = assets.map(a => a.price);
  const returns = assets.map(a => a.expectedReturn);
  
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
  
  console.log("Solved portfolio with classical approach:");
  console.log("Selected assets:", symbols.filter((_, i) => selected[i] === 1));
  console.log("Total cost:", totalCost);
  console.log("Expected return:", expectedReturn);
  
  return {
    selectedAssets: symbols.filter((_, i) => selected[i] === 1),
    binaryVector: selected,
    objectiveValue,
    totalCost,
    expectedReturn
  };
}

/**
 * Format QUBO matrix to LaTeX-like string notation for display
 */
export function formatQUBOMatrixToMath(qubo: QUBOMatrix): string {
  const n = qubo.matrix.length;
  let mathString = `\\begin{bmatrix}\n`;
  
  for (let i = 0; i < n; i++) {
    const row = qubo.matrix[i].map(val => val.toFixed(2)).join(' & ');
    mathString += row + (i < n - 1 ? ' \\\\\n' : '\n');
  }
  
  mathString += `\\end{bmatrix}`;
  return mathString;
}

/**
 * Generate a simplified explanation of QUBO formulation for display
 */
export function generateQUBOExplanation(params: PortfolioParams): string {
  const { weights, assets, budget } = params;
  const { returnWeight, budgetWeight, diversificationWeight } = weights;
  
  return `
## QUBO Formulation for Portfolio of ${assets.length} Assets

### Objective Function:
$$f(x) = -${returnWeight.toFixed(2)}\\sum_{i}x_ir_i + ${budgetWeight.toFixed(2)}(\\sum_{i}x_ip_i - ${budget})^2 + ${diversificationWeight.toFixed(2)}\\sum_{i,j}x_i\\text{cov}(p_i,p_j)x_j$$

Where:
- $x_i \\in \\{0,1\\}$ (binary decision variables: buy or don't buy)
- $p_i$ = asset price
- $r_i$ = expected return
- $\\text{cov}(p_i,p_j)$ = covariance between assets i and j

### Matrix Form:
The QUBO can be expressed as: $f(x) = x^TQx + q^Tx + c$
  `;
}

/**
 * Convert QUBO problem to Ising model format
 * The Ising model uses variables y ∈ {-1,1} instead of x ∈ {0,1}
 */
export function convertQUBOToIsing(qubo: QUBOMatrix): {
  h: number[];  // Qubit weights
  J: number[][]; // Coupler strengths
  gamma: number; // Constant offset
} {
  const n = qubo.matrix.length;
  const J: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const h: number[] = Array(n).fill(0);
  
  // Convert Q matrix to J couplers (J_ij = Q_ij/4)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        J[i][j] = qubo.matrix[i][j] / 4;
      }
    }
  }
  
  // Calculate h weights (h_i = q_i/2 + ∑_j J_ij)
  for (let i = 0; i < n; i++) {
    const q_i = qubo.matrix[i][i];
    let sum_j = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        sum_j += J[i][j];
      }
    }
    h[i] = q_i / 2 + sum_j;
  }
  
  // Calculate constant offset gamma
  let gamma = qubo.expectedValue;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      gamma += qubo.matrix[i][j] / 4;
    }
    gamma += qubo.matrix[i][i] / 2;
  }
  
  return { h, J, gamma };
}
