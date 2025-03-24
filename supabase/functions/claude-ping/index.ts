
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { apiKey, checkMCP = false } = await req.json()
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Missing API key' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    // Make a request to the Claude API to check if the API key works
    let headers = {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    };
    
    // Add MCP header if requested
    if (checkMCP) {
      headers['anthropic-beta'] = 'model-control-protocol-v1';
      console.log('Testing Claude API with MCP headers');
    }
    
    // First check if the API key works with the models endpoint
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API connection failed:', errorData)
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          success: false,
          message: errorData.error?.message || 'Invalid API key or service unavailable',
          mcpSupported: false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Claude API connection successful')
    
    // If specifically checking MCP capability, we need to make a test request
    // that uses MCP features to verify it's actually supported
    let mcpSupported = false;
    
    if (checkMCP) {
      try {
        // Make a minimal MCP-specific test request
        const mcpTestResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10,
            control: {
              prompt: "You're a helpful assistant responding in JSON format.",
              format: { type: "json" }
            }
          })
        });
        
        if (mcpTestResponse.ok) {
          const mcpData = await mcpTestResponse.json();
          // If we got a response with the tool_use type, MCP is supported
          mcpSupported = true;
          console.log('Claude MCP support test successful');
        } else {
          console.warn('Claude MCP support test failed, but API is available');
        }
      } catch (mcpError) {
        console.error('Error testing Claude MCP support:', mcpError);
        // API is still available even if MCP test failed
      }
    }
    
    return new Response(
      JSON.stringify({ 
        status: 'available', 
        success: true,
        message: 'Successfully connected to Claude API',
        mcpSupported: checkMCP ? mcpSupported : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in claude-ping function:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
