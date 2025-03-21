
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get API keys from environment
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, marketData, includeQuantumApproach = false } = await req.json();
    
    console.log("Received market analysis request with message:", message);
    console.log("Market data context:", marketData ? JSON.stringify(marketData) : "none");
    console.log("Include quantum approach:", includeQuantumApproach);

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
        
        IMPORTANT GUIDELINES:
        1. When discussing portfolio optimization, always explain both traditional and QUBO formulations.
        2. Explain how the binary decision variables work (1 = include asset, 0 = exclude asset).
        3. Explain that quantum annealing is particularly good at finding global minima in complex landscapes.
        4. Clarify that you're providing quantum-inspired simulations, not actual quantum computing results.
        5. ALWAYS EMPHASIZE that you only provide analysis and research - the user makes all final investment decisions.
        6. When asked about QUBO formulation, explain the process using the formula above.
        
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
        max_tokens: 500
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
