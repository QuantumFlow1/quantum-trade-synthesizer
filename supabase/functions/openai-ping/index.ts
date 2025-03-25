
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
    const { apiKey } = await req.json()
    
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
    
    if (response.ok) {
      console.log('OpenAI API connection successful')
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          success: true,
          message: 'Successfully connected to OpenAI API' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      const errorData = await response.json()
      console.error('OpenAI API connection failed:', errorData)
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          success: false,
          message: errorData.error?.message || 'Invalid API key or service unavailable' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
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
