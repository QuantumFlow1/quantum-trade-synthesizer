
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
    
    console.log(`DeepSeek API ping request received, key length: ${apiKey ? apiKey.length : 0}`)
    
    if (!apiKey) {
      console.error('Missing API key in request')
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
    
    // Make a simple request to the DeepSeek API to check if the API key works
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`DeepSeek API response status: ${response.status}`)
    
    if (response.ok) {
      const models = await response.json()
      console.log('DeepSeek API connection successful, found models:', models.data ? models.data.length : 0)
      
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          success: true,
          message: 'Successfully connected to DeepSeek API',
          modelCount: models.data ? models.data.length : 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { error: { message: await response.text() } }
      }
      
      console.error('DeepSeek API connection failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          success: false,
          message: errorData.error?.message || `API error: ${response.status} ${response.statusText}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Error in deepseek-ping function:', error)
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
