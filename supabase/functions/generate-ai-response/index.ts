
// This is a fallback service that uses OpenAI when Grok3 is unavailable
import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

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

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
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
    const requestData = await req.json()
    const { message, history } = requestData

    console.log('Received request with message length:', message?.length || 0)
    console.log('History items:', history?.length || 0)

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: 'Je bent een behulpzame AI-assistent. Geef duidelijke, beknopte en behulpzame antwoorden op vragen van gebruikers. Communiceer in het Nederlands tenzij anders aangegeven.' },
      ...(history || []),
      { role: 'user', content: message }
    ]

    // Make request to OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      const errorData = await response.text()
      console.error('Error details:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API request failed: ${response.status} ${response.statusText}`,
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
    console.log('OpenAI API response received')

    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
        status: 'success'
      }),
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('Error in generate-ai-response function:', error)
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
