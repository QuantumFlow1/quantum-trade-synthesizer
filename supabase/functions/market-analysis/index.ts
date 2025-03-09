
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

    // Create a prompt that includes market context
    const marketContext = marketData 
      ? `Current market data:
        Market: ${marketData.market || 'unknown'}
        Symbol: ${marketData.symbol || 'unknown'}
        Current Price: $${marketData.price || 0}
        24h Change: ${marketData.change24h || 0}%
        24h High: $${marketData.high24h || 0}
        24h Low: $${marketData.low24h || 0}
        Volume: ${marketData.volume || 0}
        Market Cap: ${marketData.marketCap || 0}
        You are a market analysis AI assistant specializing in financial analysis. Provide accurate, insightful analysis based on this data.`
      : 'You are a market analysis AI assistant. No specific market data is available, so provide general trading advice.';

    console.log("Sending request to OpenAI with market context");
    
    // Call OpenAI API
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
