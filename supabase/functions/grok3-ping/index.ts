
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Extract API key from environment
    const apiKey = Deno.env.get('GROK3_API_KEY')
    
    // Simple health check - just verify we have an API key set
    const status = apiKey && apiKey !== 'CHANGEME' ? 'available' : 'unavailable'
    
    // Return status - we don't actually need to make an external API call
    // just to check if the function itself is working
    return new Response(
      JSON.stringify({ 
        status,
        message: status === 'available' ? 'API key is configured' : 'API key is not configured',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error in grok3-ping:', error)
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  }
})
