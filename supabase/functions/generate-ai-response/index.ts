
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from "../_shared/cors.ts"
import { OpenAI } from "https://esm.sh/openai@3.3.0"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || ''

// Create OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { prompt, voiceId } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Generating AI response for prompt: ${prompt.substring(0, 100)}...`)
    console.log(`Voice ID (if specified): ${voiceId || 'not specified'}`)

    // Check if the prompt is requesting web access
    if (prompt.toLowerCase().includes('open') || 
        prompt.toLowerCase().includes('search') || 
        prompt.toLowerCase().includes('browse') ||
        prompt.toLowerCase().includes('http') ||
        prompt.toLowerCase().includes('website') ||
        prompt.toLowerCase().includes('www')) {
      
      const response = voiceId?.includes('EdriziAI') 
        ? `Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met informatie en vragen op basis van mijn training. Hoe kan ik je verder helpen?`
        : `I cannot open external websites or browse the internet. As an AI assistant, I don't have the ability to access web links or pages. I can help you with information and questions based on my training. How else can I assist you?`
      
      return new Response(
        JSON.stringify({ response }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    
    // Determine system prompt based on voiceId
    let systemPrompt = "You are Edrizi AI, a helpful AI assistant. Answer questions clearly and concisely."
    
    if (voiceId?.includes('EdriziAI')) {
      systemPrompt = `You are EdriziAI, an advanced AI assistant specialized in trading and financial markets. 
        Always respond in the same language as the user's question.
        Provide factual, helpful information and avoid making up details you don't know.
        Be conversational but professional.`
    }

    // Create the messages for the chat completion
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ]

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    })

    const response = completion.data.choices[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try asking in a different way."
    
    console.log(`Generated response: ${response.substring(0, 100)}...`)

    // Return the response
    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating AI response:', error)
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate AI response' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
