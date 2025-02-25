
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

console.log("Grok3 response function loaded")

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY')
    
    // Log API key availability (not the actual key)
    console.log('Grok3 API key present:', !!GROK3_API_KEY)

    // Handle ping test
    const { message, context } = await req.json()
    console.log('Received request:', { message, contextLength: context?.length })
    
    if (message === "system: ping test") {
      console.log('Handling ping test')
      return new Response(
        JSON.stringify({ 
          response: "pong",
          status: "available"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!GROK3_API_KEY) {
      console.error('No Grok3 API key found in environment')
      throw new Error('Grok3 API key not configured')
    }

    console.log('Preparing to call Grok3 API')
    
    // Here we would make the actual API call to Grok3
    // For now, let's simulate a successful response
    const response = `Dit is een test antwoord van de Grok3 API. Je vroeg: "${message}"`
    
    console.log('Successfully generated response')

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error('Error in Grok3 response function:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }
})
