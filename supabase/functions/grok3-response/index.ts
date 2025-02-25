
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
    const { message, context } = await req.json()
    
    if (!message) {
      throw new Error('Message is required')
    }

    // Get API key from environment
    const grokApiKey = Deno.env.get('GROK3_API_KEY')
    if (!grokApiKey) {
      throw new Error('GROK3_API_KEY is not set in the environment variables')
    }

    console.log(`Calling Grok3 API with message: ${message.substring(0, 50)}...`)
    
    // Call the Grok3 API
    const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are EdriziAI, a super admin assistant with extremely advanced capabilities. You provide comprehensive trading analyses, market insights, and technical information to administrators. Be detailed, thorough, and always provide extensive context in your responses.'
          },
          ...(context && Array.isArray(context) ? context : []),
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!grokResponse.ok) {
      const errorData = await grokResponse.json()
      console.error('Grok3 API error:', errorData)
      throw new Error(`Grok3 API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await grokResponse.json()
    const aiResponse = data.choices[0].message.content

    console.log(`Received response from Grok3 API: ${aiResponse.substring(0, 50)}...`)

    return new Response(
      JSON.stringify({
        response: aiResponse,
        model: data.model,
        usage: data.usage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in grok3-response function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
