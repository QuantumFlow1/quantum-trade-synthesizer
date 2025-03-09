
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || ''

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { message, userId, userLevel = 'beginner', previousMessages = [] } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating trading advice for message: ${message.substring(0, 100)}...`)
    console.log(`User level: ${userLevel}`)

    // Get the API key - first try the environment variable, then the client-provided key
    let apiKey = GROQ_API_KEY
    const clientProvidedKey = req.headers.get('x-groq-api-key')
    
    if (!apiKey && clientProvidedKey) {
      apiKey = clientProvidedKey
    }
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Groq API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Build the prompt based on user level
    let systemPrompt = 'You are Stockbot, a professional trading assistant specialized in helping users with market analysis and trading advice. You are powered by T.S.A.A. (Trading Strategie Advies Agents) that analyze market data and provide recommendations. '
    
    // Add level-specific instructions
    switch (userLevel) {
      case 'expert':
        systemPrompt += 'The user is an expert trader. Use advanced terminology and detailed analysis. Skip basic explanations.'
        break
      case 'intermediate':
        systemPrompt += 'The user has intermediate trading knowledge. Provide detailed explanations and some deeper insights.'
        break
      case 'beginner':
      default:
        systemPrompt += 'The user is new to trading. Explain concepts clearly and avoid jargon. Focus on basics and educational content.'
        break
    }
    
    // Add response guidelines
    systemPrompt += ' Always respond in the same language as the user\'s question. Provide factual, helpful information about trading and market analysis. Never pretend to access real-time market data if you don\'t have it.'

    // Check for patterns that might indicate web requests or other unsupported tasks
    if (message.toLowerCase().includes('open') || 
        message.toLowerCase().includes('search') || 
        message.toLowerCase().includes('browse') ||
        message.toLowerCase().includes('http') ||
        message.toLowerCase().includes('website') ||
        message.toLowerCase().includes('www')) {
      
      const response = `Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met trading informatie, analyse en educatie op basis van mijn training. Hoe kan ik je verder helpen met je trading vragen?`
      
      return new Response(
        JSON.stringify({ response }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    
    // Add context from previous messages if available
    const chatContext = previousMessages.length > 0 
      ? previousMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      : []
    
    // Create messages array for the API request
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatContext,
      { role: "user", content: message }
    ]

    console.log('Sending request to Groq API with messages')
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try asking in a different way."
    
    console.log(`Generated response: ${aiResponse.substring(0, 100)}...`)

    // Return the response
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating trading advice:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate trading advice' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
