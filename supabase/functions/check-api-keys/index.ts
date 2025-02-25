
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("API key check function loaded")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { check } = await req.json()
    console.log('Checking availability for:', check)
    
    if (check === 'grok3') {
      const grok3ApiKey = Deno.env.get('GROK3_API_KEY')
      console.log('Grok3 API key present:', !!grok3ApiKey)
      
      return new Response(
        JSON.stringify({ 
          apiKeyValid: !!grok3ApiKey,
          message: grok3ApiKey ? 'Grok3 API key is configured' : 'Grok3 API key is missing' 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid check parameter' }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )

  } catch (error) {
    console.error('Error checking API keys:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }
})
