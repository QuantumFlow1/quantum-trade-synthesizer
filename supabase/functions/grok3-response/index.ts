
import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts'

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const GROK_API_KEY = Deno.env.get('GROK3_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // For availability checks, return a simple pong
    if (req.method === 'GET') {
      console.log('Availability check received')
      return new Response(
        JSON.stringify({ response: 'pong', status: 'available' }),
        { headers: corsHeaders }
      )
    }

    if (!GROK_API_KEY) {
      console.error('GROK3_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          error: 'GROK3_API_KEY not configured',
          status: 'error' 
        }),
        { 
          status: 500,
          headers: corsHeaders 
        }
      )
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: corsHeaders 
        }
      )
    }

    // Parse request body
    const { message, context } = await req.json()
    console.log('Received request:', { message, contextLength: context?.length })

    // Make request to Grok API
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          ...(context || []),
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      console.error('Grok API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: `Grok API request failed: ${response.status} ${response.statusText}`,
          details: errorData,
          status: 'error'
        }),
        { 
          status: response.status,
          headers: corsHeaders 
        }
      )
    }

    const data = await response.json()
    console.log('Grok API response received:', data)

    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
        status: 'success'
      }),
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in grok3-response function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    )
  }
})

