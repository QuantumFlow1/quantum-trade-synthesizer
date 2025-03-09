
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
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
      console.log('Using client-provided Groq API key')
    }
    
    if (!apiKey) {
      console.error('No Groq API key available')
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
      
      const response = `I can't open external websites or browse internet links. As an AI assistant, I don't have access to the web. I can help with trading information, analysis, and education based on my training. How can I assist with your trading questions?`
      
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

    console.log('Sending request to Groq API with messages:', JSON.stringify(messages.length))
    
    try {
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
        const errorText = await response.text();
        console.error(`Groq API error: Status ${response.status}, Response:`, errorText);
        
        let errorMessage = `Groq API error: ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.message) {
            errorMessage = `Groq API error: ${errorData.error.message}`;
          }
        } catch (e) {
          // If we can't parse the error as JSON, just use the status text
          console.error("Failed to parse error response:", e);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try asking in a different way."
      
      console.log(`Generated response: ${aiResponse.substring(0, 100)}...`)

      // Return the response
      return new Response(
        JSON.stringify({ response: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
      
    } catch (apiError) {
      console.error('Groq API call failed:', apiError);
      
      // If the API call fails, return a fallback response
      const fallbackResponse = "I'm sorry, but I'm having trouble connecting to my analysis systems right now. Here's a general suggestion: Consider monitoring key support and resistance levels, set clear stop losses, and don't overcommit your capital to a single position. Would you like me to try analyzing your question again?";
      
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

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
