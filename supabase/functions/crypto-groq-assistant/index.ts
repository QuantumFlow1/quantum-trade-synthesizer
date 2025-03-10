
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key',
  'Content-Type': 'application/json'
};

// Trading tools available to the assistant
const tradingTools = [
  {
    type: "function",
    function: {
      name: "showCryptoChart",
      description: "Display an interactive cryptocurrency price chart",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string", 
            description: "The cryptocurrency symbol to display, e.g., BTC, ETH, SOL"
          },
          timeframe: {
            type: "string",
            enum: ["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"],
            description: "The timeframe to display"
          }
        },
        required: ["symbol"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCryptoPrice",
      description: "Get current price and market data for a cryptocurrency",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The cryptocurrency symbol, e.g., 'bitcoin', 'ethereum'"
          }
        },
        required: ["symbol"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCryptoNews",
      description: "Get the latest news for a specific cryptocurrency or the general market",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The cryptocurrency symbol, or 'market' for general crypto news"
          },
          count: {
            type: "number",
            description: "Number of news items to return"
          }
        },
        required: ["symbol"]
      }
    }
  }
];

// Shared system prompt for the trading assistant
const getSystemPrompt = () => {
  return `You are CryptoBot, a specialized cryptocurrency trading assistant that provides insights about crypto markets and tokens.
  You can analyze market data and use tools to visualize information.
  
  IMPORTANT: For crypto queries, use a function to display real-time charts whenever discussing specific cryptocurrencies:
  - For Bitcoin use: <function=showCryptoChart{"symbol":"BTC","timeframe":"1D"}></function> 
  - For Ethereum use: <function=showCryptoChart{"symbol":"ETH","timeframe":"1D"}></function>
  
  For price data, use: <function=getCryptoPrice{"symbol":"bitcoin"}></function>
  For news about assets, use: <function=getCryptoNews{"symbol":"bitcoin","count":3}></function>
  
  Today's date is ${new Date().toLocaleDateString()}.
  Always mention this is current data when providing market information.`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { 
      messages, 
      model = "llama-3.3-70b-versatile", 
      temperature = 0.7, 
      max_tokens = 1024,
      response_format,
      function_calling = "auto" 
    } = requestData;
    
    console.log(`Processing Groq crypto request for model: ${model}`);
    
    // Get API key from request headers or environment
    const clientApiKey = req.headers.get('x-groq-api-key');
    const apiKey = clientApiKey || Deno.env.get('GROQ_API_KEY');
    
    if (!apiKey) {
      throw new Error('Groq API key not configured. Please add your Groq API key in settings.');
    }

    // Add system message if not present
    const finalMessages = [...messages];
    if (!finalMessages.some(msg => msg.role === 'system')) {
      finalMessages.unshift({
        role: 'system',
        content: getSystemPrompt()
      });
    }

    // Prepare request to Groq API
    const requestBody: any = {
      messages: finalMessages,
      model,
      temperature,
      max_tokens,
      stream: false
    };

    if (response_format === 'json') {
      requestBody.response_format = { type: "json_object" };
    }
    
    if (function_calling !== "none") {
      requestBody.tools = tradingTools;
      if (function_calling === "auto" || function_calling === "required") {
        requestBody.tool_choice = function_calling;
      }
    }
    
    console.log("Sending request to Groq API for crypto analysis...");
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      
      console.error('Groq API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Enhanced error messages
      let errorMessage = 'An error occurred while processing your request.';
      if (response.status === 401) {
        errorMessage = 'Invalid API key or authentication error. Please check your Groq API key configuration.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
      } else if (response.status >= 500) {
        errorMessage = 'The Groq API service is currently experiencing issues. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Successfully received Groq API response for crypto analysis');
    
    // Check for empty or invalid response content
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Received invalid response from Groq API');
    }
    
    const hasToolCalls = data.choices[0]?.message?.tool_calls?.length > 0;
    
    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
        status: 'success',
        model: model,
        usage: data.usage,
        system_fingerprint: data.system_fingerprint || null,
        tool_calls: hasToolCalls ? data.choices[0].message.tool_calls : null
      }),
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Error in crypto-groq-assistant function:', error);
    
    // Create a more user-friendly error message
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      status: 'error',
      details: {
        timestamp: new Date().toISOString(),
        type: error.name,
        message: error.message
      }
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
