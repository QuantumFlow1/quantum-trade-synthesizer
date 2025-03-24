
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
    
    // Make a simple request to the OpenAI API to check if the API key works
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API connection failed:', errorData)
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
    
    // OpenAI API connection successful
    console.log('OpenAI API connection successful')
    
    // Check MCP capabilities if requested
    // For OpenAI, we check support for structured response tools
    let mcpSupported = false;
    
    if (checkMCP) {
      try {
        // Test if OpenAI supports JSON mode (which is their equivalent to MCP)
        const mcpTestResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Hello' }],
            response_format: { type: "json_object" },
            max_tokens: 10
          })
        });
        
        if (mcpTestResponse.ok) {
          mcpSupported = true;
          console.log('OpenAI JSON mode (MCP equivalent) supported');
        } else {
          console.log('OpenAI JSON mode test failed, but API is available');
        }
      } catch (mcpError) {
        console.error('Error testing OpenAI MCP support:', mcpError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        status: 'available', 
        success: true,
        message: 'Successfully connected to OpenAI API',
        mcpSupported: checkMCP ? mcpSupported : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in openai-ping function:', error)
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
