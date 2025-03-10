
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
      name: "showMarketTrend",
      description: "Display market trend information for a specific asset",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string", 
            description: "The market symbol to analyze, e.g., BTC, ETH, S&P500"
          },
          timeframe: {
            type: "string",
            enum: ["1D", "1W", "1M", "3M", "6M", "1Y"],
            description: "The timeframe to analyze"
          }
        },
        required: ["symbol"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generateTradeRecommendation",
      description: "Generate a trading recommendation for a specific asset",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The asset symbol to recommend trades for"
          },
          riskLevel: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "The risk tolerance level for the recommendation"
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
      model = "llama-3.1-70b-versatile", 
      temperature = 0.7, 
      max_tokens = 1024,
      response_format,
      function_calling = "auto" 
    } = requestData;
    
    console.log(`Processing request for model: ${model}`);
    
    // Determine which API to use based on the model
    const isGroqModel = model.includes("llama") || model.includes("mixtral");
    const apiType = isGroqModel ? "groq" : "openai";
    
    // Get API key from request headers or environment variables
    let apiKey;
    if (apiType === "groq") {
      apiKey = req.headers.get('x-groq-api-key') || Deno.env.get('GROQ_API_KEY');
    } else {
      apiKey = req.headers.get('x-openai-api-key') || Deno.env.get('OPENAI_API_KEY');
    }
    
    if (!apiKey) {
      throw new Error(`${apiType.toUpperCase()} API key not configured`);
    }

    const apiEndpoint = isGroqModel 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    // Add system message if not present
    if (!messages.some(msg => msg.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: `You are a helpful trading assistant that provides insights about markets and financial instruments.
        Today's date is ${new Date().toLocaleDateString()}.`
      });
    }

    const requestBody: any = {
      messages,
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
    
    console.log(`Sending request to ${apiType.toUpperCase()} API...`);
    
    const response = await fetch(apiEndpoint, {
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
      
      console.error(`${apiType.toUpperCase()} API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Enhanced error messages
      let errorMessage = 'An error occurred while processing your request.';
      if (response.status === 401) {
        errorMessage = `Invalid API key or authentication error. Please check your ${apiType.toUpperCase()} API key configuration.`;
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
      } else if (response.status >= 500) {
        errorMessage = `The ${apiType.toUpperCase()} API service is currently experiencing issues. Please try again later.`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parse the response as JSON and add better error handling
    let data;
    try {
      const responseText = await response.text();
      console.log("Raw API response:", responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""));
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse API response as JSON:', responseText);
        throw new Error(`Invalid JSON response from ${apiType.toUpperCase()} API`);
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error(`Failed to parse response from ${apiType.toUpperCase()} API: ${parseError.message}`);
    }
    
    console.log(`Successfully received ${apiType.toUpperCase()} API response:`, {
      id: data.id,
      model: data.model,
      choicesLength: data.choices?.length || 0
    });
    
    // Validate response structure
    if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure:', JSON.stringify(data).substring(0, 500));
      throw new Error(`Received invalid response structure from ${apiType.toUpperCase()} API`);
    }
    
    const firstChoice = data.choices[0];
    if (!firstChoice || typeof firstChoice !== 'object') {
      console.error('Invalid choice structure:', firstChoice);
      throw new Error(`Received invalid choice structure from ${apiType.toUpperCase()} API`);
    }
    
    if (!firstChoice.message || typeof firstChoice.message !== 'object') {
      console.error('Invalid message in choice:', firstChoice);
      throw new Error(`Received invalid message from ${apiType.toUpperCase()} API`);
    }
    
    // Check for empty or invalid response content
    const hasToolCalls = Array.isArray(firstChoice.message.tool_calls) && firstChoice.message.tool_calls.length > 0;
    
    // Ensure message content is always a string (even if empty when using tool calls)
    const messageContent = typeof firstChoice.message.content === 'string' ? firstChoice.message.content : "";
    
    if (!messageContent && !hasToolCalls) {
      console.error('Empty message content and no tool calls:', firstChoice.message);
      throw new Error(`Received empty content from ${apiType.toUpperCase()} API`);
    }
    
    return new Response(
      JSON.stringify({
        response: messageContent,
        status: 'success',
        model: model,
        usage: data.usage,
        system_fingerprint: data.system_fingerprint || null,
        tool_calls: hasToolCalls ? firstChoice.message.tool_calls : null
      }),
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Error in chat function:', error);
    
    // Create a more user-friendly error message
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      status: 'error',
      details: {
        timestamp: new Date().toISOString(),
        type: error.name,
        message: error.message,
        stack: error.stack
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
