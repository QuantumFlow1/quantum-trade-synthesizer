
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY')
const GROK3_API_URL = 'https://api.grok.ai/v1/chat/completions'

interface ChatMessage {
  role: string;
  content: string;
}

interface RequestBody {
  message: string;
  context?: ChatMessage[];
}

serve(async (req) => {
  console.log('Grok3 Edge Function invoked')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    // Validate API key
    if (!GROK3_API_KEY) {
      console.error('Missing GROK3_API_KEY in environment variables')
      return new Response(
        JSON.stringify({
          error: 'Server configuration error: GROK3_API_KEY is not set',
          hint: 'The administrator needs to set the GROK3_API_KEY in Supabase Edge Function secrets',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Parse request
    let body: RequestBody
    try {
      body = await req.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate request parameters
    if (!body.message) {
      console.error('Missing required field: message')
      return new Response(
        JSON.stringify({ error: 'Missing required field: message' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Prepare messages for the Grok3 API
    const context = body.context || []
    const messages = [
      { role: 'system', content: 'You are a helpful, accurate assistant. Respond in the same language the user is using.' },
      ...context,
      { role: 'user', content: body.message }
    ]

    console.log(`Sending request to Grok3 API with message: ${body.message.substring(0, 50)}...`)
    
    // Call the Grok3 API
    const response = await fetch(GROK3_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK3_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    })

    // Handle API response
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Grok3 API error (${response.status}):`, errorText)
      
      // Check for specific error types
      let errorMessage = `Grok3 API returned status code ${response.status}`
      let status = response.status
      
      if (errorText.includes('invalid_api_key') || errorText.includes('Invalid API key')) {
        errorMessage = 'Invalid Grok3 API key. Please check your credentials.'
        console.error('API key validation failed. The provided key appears to be invalid.')
        status = 401
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded for Grok3 API.'
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorText.substring(0, 200) 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: status
        }
      )
    }

    const data = await response.json()
    console.log('Successfully received response from Grok3 API')
    
    // Extract and return the response content
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const assistantResponse = data.choices[0].message.content
      console.log(`Response from Grok3: ${assistantResponse.substring(0, 50)}...`)
      
      return new Response(
        JSON.stringify({ response: assistantResponse }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } else {
      console.error('Unexpected response format from Grok3 API:', JSON.stringify(data).substring(0, 200))
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected response format from Grok3 API',
          details: JSON.stringify(data).substring(0, 200)
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unhandled error in Grok3 Edge Function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
