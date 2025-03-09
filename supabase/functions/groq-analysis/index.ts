
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
    
    // Check if API key is available - first try environment variable
    let apiKey = GROQ_API_KEY;
    
    // If not in environment, check if it was passed in the config
    if (!apiKey && config && config.apiKey) {
      apiKey = config.apiKey;
      console.log('Using API key from request config');
    }
    
    // If API key isn't provided or is empty, switch to fallback simulated response
    if (!apiKey || apiKey.trim() === '') {
      console.log('API key missing, generating fallback response');
      
      // Generate a simulated response instead of calling the API
      const fallbackResponse = generateFallbackResponse(marketData);
      
      return new Response(
        JSON.stringify({ 
          result: fallbackResponse, 
          status: 'success',
          source: 'fallback'
        }),
        { headers: corsHeaders }
      );
    }
    
    // Format the market data for the prompt
    const marketSummary = `
    Symbol: ${marketData.symbol}
    Current Price: $${marketData.price.toFixed(2)}
    24h Change: ${marketData.change24h || 'Unknown'}%
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
        'Authorization': `Bearer ${apiKey}`,
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
      
      // If we get a 401 Unauthorized, it means the API key is invalid
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            result: generateFallbackResponse(marketData),
            error: 'Invalid Groq API key. Please check your API key and try again.',
            status: 'success',
            source: 'fallback' 
          }),
          { headers: corsHeaders }
        );
      }
      
      // For other errors, generate a fallback response
      const fallbackResponse = generateFallbackResponse(marketData);
      
      return new Response(
        JSON.stringify({ 
          result: fallbackResponse, 
          status: 'success',
          source: 'fallback' 
        }),
        { headers: corsHeaders }
      );
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
    
    // Return a fallback response when an exception occurs
    const fallbackResponse = generateFallbackResponse();
    
    return new Response(
      JSON.stringify({ 
        result: fallbackResponse,
        error: `API call error: ${error.message || 'Unknown error'}`,
        status: 'success',
        source: 'fallback'
      }),
      { status: 200, headers: corsHeaders }
    );
  }
});

// Helper function to generate a fallback response when the API is unavailable
function generateFallbackResponse(marketData: any = null) {
  // Generate random sentiment based on market data or just random if no data
  let sentiment = "neutral";
  let recommendation = "HOLD";
  let confidence = 60;
  
  if (marketData) {
    // If we have market data, try to make the recommendation somewhat sensible
    const randomFactor = Math.random();
    const change = marketData.change24h || 0;
    
    if (change > 2 && randomFactor > 0.6) {
      sentiment = "bullish";
      recommendation = "BUY";
      confidence = 70 + Math.floor(Math.random() * 15);
    } else if (change < -2 && randomFactor > 0.6) {
      sentiment = "bearish";
      recommendation = "SELL";
      confidence = 70 + Math.floor(Math.random() * 15);
    } else {
      // Middle ground
      sentiment = "neutral";
      recommendation = "HOLD";
      confidence = 50 + Math.floor(Math.random() * 20);
    }
  } else {
    // Completely random if no market data
    const random = Math.random();
    if (random > 0.66) {
      sentiment = "bullish";
      recommendation = "BUY";
      confidence = 65 + Math.floor(Math.random() * 20);
    } else if (random > 0.33) {
      sentiment = "bearish";
      recommendation = "SELL";
      confidence = 65 + Math.floor(Math.random() * 20);
    } else {
      sentiment = "neutral";
      recommendation = "HOLD";
      confidence = 50 + Math.floor(Math.random() * 25);
    }
  }
  
  // Create a response in the format the frontend expects
  return {
    recommendation: recommendation,
    confidence: confidence,
    reasoning: `Based on ${marketData ? 'available market data' : 'general market conditions'}, a ${sentiment} outlook suggests a ${recommendation.toLowerCase()} position would be prudent. Note: This is a simulated response as the Groq API is unavailable.`,
    marketSignals: {
      technicalIndicators: [
        "Moving averages show mixed signals",
        "Volume trends are neutral",
      ],
      fundamentalFactors: [
        "Market sentiment is cautiously optimistic",
        "Economic indicators suggest stable conditions"
      ],
      sentimentAnalysis: `${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} market sentiment observed`
    },
    riskAssessment: {
      level: "medium",
      factors: [
        "Market volatility is average",
        "Liquidity is adequate",
        "Geopolitical factors present moderate risk"
      ]
    }
  };
}
