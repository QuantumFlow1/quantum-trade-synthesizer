import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key',
  'Content-Type': 'application/json'
};

const tradingTools = [
  {
    type: "function",
    function: {
      name: "showStockChart",
      description: "Display an interactive stock price chart for a specific symbol",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string", 
            description: "The stock symbol to display, e.g., AAPL, MSFT, GOOGL"
          },
          timeframe: {
            type: "string",
            enum: ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y"],
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
      name: "showMarketHeatmap",
      description: "Display a sector performance heatmap of the stock market",
      parameters: {
        type: "object",
        properties: {
          sector: {
            type: "string",
            description: "The market sector to focus on (e.g., 'Technology', 'Energy', 'all')"
          }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStockNews",
      description: "Get the latest news for a specific stock or the general market",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock symbol to get news for, or 'market' for general market news"
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
    
    console.log(`Processing Groq chat request for model: ${model}`);
    
    const clientApiKey = req.headers.get('x-groq-api-key');
    const apiKey = clientApiKey || Deno.env.get('GROQ_API_KEY');
    
    if (!apiKey) {
      console.error('No Groq API key available');
      throw new Error('API key not configured');
    }

    const keyLength = apiKey.length;
    console.log(`Using Groq API key (length: ${keyLength})`);
    
    const requestBody: any = {
      messages,
      model,
      temperature,
      max_tokens
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
    
    console.log("Sending request to Groq API...");
    
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
      
      if (response.status === 401) {
        throw new Error('Invalid API key or authentication error');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (response.status >= 500) {
        throw new Error('Groq API service error. Please try again later');
      }
      
      throw new Error(errorData?.error?.message || `API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully received Groq API response');
    
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
    console.error('Error in groq-chat function:', error);
    
    const errorResponse = {
      error: error.message || 'Unknown error occurred',
      status: 'error',
      details: error.stack
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
