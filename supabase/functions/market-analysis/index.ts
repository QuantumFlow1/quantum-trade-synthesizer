
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
    console.log("Received request to market-analysis function");
    
    // Parse request body
    let requestData = {};
    try {
      requestData = await req.json();
      console.log("Request data:", JSON.stringify(requestData));
    } catch (e) {
      console.error("Error parsing request JSON:", e);
      requestData = {}; // Default to empty if parsing fails
    }
    
    const { message, marketData } = requestData;
    
    // Validate inputs
    if (!message || typeof message !== 'string') {
      console.error("Invalid or missing message in request");
      return new Response(
        JSON.stringify({ 
          error: "Missing or invalid message parameter" 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }

    // Check for API key
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

    // Enhance the prompt with additional real-time market context if available
    let enhancedPrompt = message;
    
    if (marketData) {
      // Try to fetch some additional market data for context
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        if (response.ok) {
          const globalData = await response.json();
          
          enhancedPrompt = `
Current market data:
Market: ${marketData.market || 'Cryptocurrency'}
Symbol: ${marketData.symbol || 'unknown'}
Current Price: $${marketData.price || 0}
24h Change: ${marketData.change24h || 0}%
24h High: $${marketData.high24h || 0}
24h Low: $${marketData.low24h || 0}
Volume: ${marketData.volume24h || 0}
Market Cap: ${marketData.marketCap || 0}

Global crypto market:
Total Market Cap: $${globalData.data?.total_market_cap?.usd?.toLocaleString() || 'N/A'}
24h Volume: $${globalData.data?.total_volume?.usd?.toLocaleString() || 'N/A'}
BTC Dominance: ${globalData.data?.market_cap_percentage?.btc?.toFixed(2) || 'N/A'}%

User query: ${message}

You are a market analysis AI assistant specializing in cryptocurrency analysis. Provide accurate, insightful analysis based on this data. Include potential support and resistance levels, trend analysis, and a short-term outlook.`;
        } else {
          // Fall back to basic prompt if global data fetch fails
          enhancedPrompt = `
Current market data:
Market: ${marketData.market || 'Cryptocurrency'}
Symbol: ${marketData.symbol || 'unknown'}
Current Price: $${marketData.price || 0}
24h Change: ${marketData.change24h || 0}%
24h High: $${marketData.high24h || 0}
24h Low: $${marketData.low24h || 0}
Volume: ${marketData.volume24h || 0}
Market Cap: ${marketData.marketCap || 0}

User query: ${message}

You are a market analysis AI assistant specializing in cryptocurrency analysis. Provide accurate, insightful analysis based on this data.`;
        }
      } catch (error) {
        console.log("Error fetching additional market context:", error);
        // Fall back to basic prompt with available data
        enhancedPrompt = `
Current market data:
Market: ${marketData.market || 'unknown'}
Symbol: ${marketData.symbol || 'unknown'}
Current Price: $${marketData.price || 0}
24h Change: ${marketData.change24h || 0}%

User query: ${message}

You are a market analysis AI assistant. Provide your best analysis based on this limited data.`;
      }
    } else {
      enhancedPrompt = `
User query: ${message}

You are a market analysis AI assistant. No specific market data is available, so provide general cryptocurrency trading advice and analysis based on your knowledge.`;
    }

    console.log("Sending request to OpenAI with enhanced market context");
    
    // Call OpenAI API with the enhanced prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a cryptocurrency market analysis assistant with expertise in technical and fundamental analysis.' },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: error
        }),
        { 
          headers: corsHeaders,
          status: response.status
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    console.log("Successfully generated AI response");

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Uncaught error in market-analysis function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred during analysis",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
