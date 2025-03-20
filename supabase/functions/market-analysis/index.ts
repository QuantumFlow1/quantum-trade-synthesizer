
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
    
    // Add quantum optimization context if requested
    if (includeQuantumApproach) {
      systemPrompt += `
        
        You also have expertise in quantum computing approaches to financial optimization problems.
        
        IMPORTANT GUIDELINES:
        1. You can explain quantum optimization concepts like QUBO (Quadratic Unconstrained Binary Optimization) and how they apply to portfolio optimization.
        2. You can simulate how quantum annealing techniques might be applied to analyze market data and optimize portfolios.
        3. The user is restricted to optimizing a maximum of 16 positions/assets at once due to quantum hardware limitations.
        4. When discussing portfolio optimization, frame it in terms of QUBO problems suitable for quantum annealing.
        5. ALWAYS EMPHASIZE that you only provide analysis and research - the user makes all final decisions. You have NO authority to take actions.
        6. For portfolio optimization questions, explain both classical and quantum-inspired approaches, highlighting potential advantages of quantum methods.
        7. Clarify that you're using quantum-inspired simulations, not actual quantum computing results.
        
        If asked specifically about QUBO formulation, you can explain the process using this format:
        - Define binary variables (xi) for each asset (1=include, 0=exclude)
        - Construct objective function: minimize x^T Q x + c^T x
          where Q represents quadratic terms (including risk/covariance)
          and c represents linear terms (expected returns)
        - Explain how constraints (like budget) can be included as penalty terms
        
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
