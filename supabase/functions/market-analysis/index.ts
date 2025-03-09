
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
    const { message, marketData } = await req.json();
    
    console.log("Received market analysis request with message:", message);
    console.log("Market data context:", marketData ? JSON.stringify(marketData) : "none");

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

    // Create a prompt that includes market context
    const marketContext = marketData 
      ? `Current market data:
        Market: ${marketData.market}
        Symbol: ${marketData.symbol}
        Current Price: $${marketData.price}
        24h Change: ${marketData.change24h}%
        24h High: $${marketData.high24h}
        24h Low: $${marketData.low24h}
        Volume: ${marketData.volume}
        Market Cap: ${marketData.marketCap}
        You are a market analysis AI assistant specializing in financial analysis. Provide accurate, insightful analysis based on this data.`
      : 'You are a market analysis AI assistant. No specific market data is available, so provide general trading advice.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: marketContext },
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
