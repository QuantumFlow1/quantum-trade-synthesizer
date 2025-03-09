
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

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
    // Parse the request body
    const { marketData, config } = await req.json();
    
    if (!GROQ_API_KEY) {
      console.error('No Groq API key provided in environment');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured on server',
          status: 'unavailable' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Format the market data for the prompt
    const marketSummary = `
    Symbol: ${marketData.symbol}
    Current Price: $${marketData.price.toFixed(2)}
    24h Change: ${marketData.change24h}%
    Market Cap: $${marketData.marketCap ? marketData.marketCap.toLocaleString() : 'Unknown'}
    Volume: $${marketData.volume ? marketData.volume.toLocaleString() : 'Unknown'}
    52-Week Range: ${marketData.low52w ? `$${marketData.low52w.toFixed(2)}` : 'Unknown'} - ${marketData.high52w ? `$${marketData.high52w.toFixed(2)}` : 'Unknown'}
    `;
    
    // Construct the prompt for Groq
    const messages = [
      { role: "system", content: config.systemPrompt },
      { role: "user", content: `Please analyze the following market data and provide a trading recommendation:\n\n${marketSummary}` }
    ];
    
    console.log('Calling Groq API with model:', config.model);
    
    // Call the Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error (${response.status}): ${errorText}`);
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response from Groq
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
      console.log('Groq analysis result:', JSON.stringify(analysisResult).substring(0, 200) + '...');
    } catch (e) {
      console.error('Error parsing Groq response as JSON:', e);
      console.log('Raw content:', content);
      
      // If parsing fails, attempt to extract key information using regex
      const recommendation = content.match(/recommendation["\s:]+([A-Z]+)/i)?.[1] || "HOLD";
      const confidence = parseInt(content.match(/confidence["\s:]+(\d+)/i)?.[1] || "50");
      const reasoning = content.match(/reasoning["\s:"]+([^"]+)/i)?.[1] || 
                        "Based on available market data, a cautious approach is recommended.";
      
      analysisResult = {
        recommendation,
        confidence,
        reasoning,
        marketSignals: {
          technicalIndicators: [],
          fundamentalFactors: [],
          sentimentAnalysis: "Mixed signals in the market"
        },
        riskAssessment: {
          level: "medium",
          factors: []
        }
      };
    }
    
    return new Response(
      JSON.stringify({ result: analysisResult, status: 'success' }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in groq-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: `API call error: ${error.message || 'Unknown error'}`,
        status: 'error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
