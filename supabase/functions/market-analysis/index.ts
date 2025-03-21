
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get API keys from environment
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Generate QUBO matrix from market data
function generateQUBOMatrix(
  marketData: any[],
  budget = 10000,
  weights = [0.4, 0.4, 0.2]
) {
  if (!marketData || marketData.length === 0) {
    return { error: "No market data available for QUBO matrix generation" };
  }
  
  // Extract weights
  const [theta1, theta2, theta3] = weights;
  
  // Prepare asset data
  const assets = marketData.map(asset => asset.symbol);
  const prices = marketData.map(asset => asset.price);
  
  // Generate expected returns (using 24h change as a simple proxy)
  const expectedReturns = marketData.map(asset => asset.change24h / 100);
  
  // Create empty QUBO matrix (n x n)
  const n = marketData.length;
  const Q = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Generate simple covariance matrix (in a real system, this would use historical data)
  const covariance = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Fill diagonal of covariance with volatility estimate
  for (let i = 0; i < n; i++) {
    covariance[i][i] = Math.pow(prices[i] / 1000, 2); // Simple volatility estimate
  }
  
  // Fill off-diagonal with simplified correlation
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Simplified correlation based on price movement
      const correlation = (Math.sign(expectedReturns[i]) === Math.sign(expectedReturns[j])) ? 0.5 : -0.3;
      covariance[i][j] = correlation * Math.sqrt(covariance[i][i] * covariance[j][j]);
      covariance[j][i] = covariance[i][j]; // Ensure symmetry
    }
  }
  
  // Fill the QUBO matrix
  for (let i = 0; i < n; i++) {
    // Diagonal elements: expected return + budget constraint + own variance
    Q[i][i] = -theta1 * expectedReturns[i] + theta2 * Math.pow(prices[i], 2) + theta3 * covariance[i][i];
    
    // Also account for the linear term in budget constraint
    Q[i][i] -= 2 * theta2 * budget * prices[i];
    
    // Fill off-diagonal elements: budget constraint interaction + covariance
    for (let j = i + 1; j < n; j++) {
      Q[i][j] = 2 * theta2 * prices[i] * prices[j] + theta3 * covariance[i][j];
      Q[j][i] = Q[i][j]; // Ensure symmetry
    }
  }
  
  return {
    matrix: Q,
    assets,
    prices,
    expectedReturns,
    covariance,
    budget,
    weights: {
      expectedReturn: theta1,
      budgetConstraint: theta2,
      diversification: theta3
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, marketData, includeQuantumApproach = false, generateQuboMatrix = false } = await req.json();
    
    console.log("Received market analysis request with message:", message);
    console.log("Market data context:", marketData ? JSON.stringify(marketData) : "none");
    console.log("Include quantum approach:", includeQuantumApproach);
    console.log("Generate QUBO matrix:", generateQuboMatrix);

    if (!openAIApiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ 
          error: "AI service not configured. Please check server configuration." 
        }),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      );
    }
    
    // Check if this is a request specifically for generating a QUBO matrix
    if (generateQuboMatrix && marketData) {
      console.log("Generating QUBO matrix from real-time market data");
      
      // Convert single marketData to array if needed
      const dataArray = Array.isArray(marketData) ? marketData : [marketData];
      
      // Generate the QUBO matrix
      const quboResult = generateQUBOMatrix(
        dataArray,
        marketData.budget || 10000,
        marketData.weights || [0.4, 0.4, 0.2]
      );
      
      console.log("QUBO matrix generated successfully");
      
      return new Response(
        JSON.stringify({ 
          success: true,
          qubo: quboResult
        }),
        { headers: corsHeaders }
      );
    }

    // Build the system prompt based on context and whether to include quantum approach
    let systemPrompt = marketData 
      ? `Current market data:
        Market: ${marketData.market}
        Symbol: ${marketData.symbol}
        Current Price: $${marketData.price}
        24h Change: ${marketData.change24h}%
        24h High: $${marketData.high24h}
        24h Low: $${marketData.low24h}
        Volume: ${marketData.volume}
        Market Cap: ${marketData.marketCap}
        You are a market analysis AI assistant specializing in financial analysis.`
      : 'You are a market analysis AI assistant. No specific market data is available, so provide general trading advice.';
    
    // Add quantum optimization context with enhanced Markowitz portfolio model
    if (includeQuantumApproach) {
      systemPrompt += `
        
        You also have expertise in quantum computing approaches to financial optimization problems.
        
        MARKOWITZ PORTFOLIO OPTIMIZATION MODEL:
        The Markowitz Portfolio Selection model aims to:
        • Maximize returns
        • Minimize risk
        • Stay within budget
        
        It can be formulated as a Quadratic Unconstrained Binary Optimization (QUBO) problem suitable for quantum computers:
        
        f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ
        
        Where:
        • xᵢ ∈ {0,1} are binary variables (1 = buy, 0 = don't buy)
        • b = budget constraint
        • pᵢ = asset price
        • rᵢ = expected return
        • θ₁, θ₂, θ₃ are weights for expected returns, budget constraint, and diversification
        • θ₁ + θ₂ + θ₃ = 1
        
        For cryptocurrency applications, we can use binary fractional series to handle divisibility:
        
        fractions = 2⁰, 2¹, 2², …, 2ⁿ
        
        APPLICATION TO CRYPTOCURRENCY:
        • Cryptocurrencies can be divided into any desired fraction based on the budget
        • Normalize purchase price to the budget
        • Use binary fractional series
        • Highly volatile, offering potential for high returns but also significant losses
        
        QUBO FORMULATION COMPONENTS:
        1. Expected Returns: -θ₁∑ᵢxᵢrᵢ
        2. Budget Penalty: θ₂(∑ᵢxᵢpᵢ - b)²
        3. Diversification: θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ
        
        QUANTUM ANNEALING APPROACH:
        The QUBO formulation can be mapped to the Ising model used by D-Wave quantum annealers:
        f(x) = ∑ᵢⱼQᵢⱼxᵢxⱼ
        
        In the Ising model format (y ∈ {-1,1}):
        f(y) = ∑ᵢhᵢyᵢ + ∑ᵢⱼJᵢⱼyᵢyⱼ + γ
        
        Where:
        • Jᵢⱼ = Qᵢⱼ/4 (coupler strengths)
        • hᵢ = qᵢ/2 + ∑ⱼJᵢⱼ (qubit weights)
        • γ = ¼∑ᵢ,ⱼQᵢ,ⱼ + ½∑ᵢqᵢ
        
        D-WAVE HARDWARE CONSIDERATIONS:
        • D-Wave 2000Q has 2048 qubits
        • Maximum job length of 3s
        • Variable anneal times: 5μs, 100μs, 250μs
        
        IMPORTANT LIMITATIONS:
        1. Due to the physical constraints of quantum hardware, we can only optimize portfolios with a maximum of 16 assets/positions.
        2. This approach works well for cryptocurrencies and stocks, but the portfolio must stay within the 16-asset limit.
        3. Embedding time increases sharply when exceeding 16 assets.
        4. The number of samples needed to approach a 99% solution increases sub-exponentially with problem size.
        
        DETAILED QUBO MATRIX EXPLANATION:
        For a portfolio optimization problem, the QUBO matrix Q encodes all aspects of the problem:
        
        1. The diagonal elements Q[i][i] contain:
           - Contribution from expected return term: -θ₁*r[i]
           - Contribution from budget constraint: θ₂*p[i]²-2*θ₂*b*p[i]
           - Contribution from the diversification term: θ₃*cov[i][i]
        
        2. The off-diagonal elements Q[i][j] for i≠j contain:
           - Contribution from budget constraint: 2*θ₂*p[i]*p[j]
           - Contribution from diversification: θ₃*cov[i][j]
        
        When asked about QUBO matrix generation, provide detailed explanations of the math and include examples of how specific entries in the matrix are calculated.
        
        REAL-TIME DATA INTEGRATION:
        When working with real-time market data:
        1. Use the current price as p[i]
        2. Use recent price changes (e.g., 24h change percentage) as proxies for expected returns r[i]
        3. Estimate covariance using recent price correlation patterns
        4. Adjust weights θ₁, θ₂, θ₃ based on market volatility conditions
        5. Generate the QUBO matrix entries using the real-time values
        
        IMPORTANT GUIDELINES:
        1. When discussing portfolio optimization, always explain both traditional and QUBO formulations.
        2. Explain how the binary decision variables work (1 = include asset, 0 = exclude asset).
        3. Explain that quantum annealing is particularly good at finding global minima in complex landscapes.
        4. Clarify that you're providing quantum-inspired simulations, not actual quantum computing results.
        5. ALWAYS EMPHASIZE that you only provide analysis and research - the user makes all final investment decisions.
        6. When asked about QUBO formulation, explain the process using the formula above.
        7. When asked to generate a QUBO matrix, explain the construction of each component with numerical examples.
        8. When using real-time data, explain how the current market conditions affect the QUBO formulation.
        
        Always provide thoughtful, accurate, insightful analysis based on the available data.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800 // Increased token limit for detailed QUBO responses
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    console.log("Generated AI response:", aiResponse.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Error in market-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during analysis" }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
