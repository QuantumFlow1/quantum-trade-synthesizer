
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// DeepSeek API URL
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method === 'GET') {
    // Simple health check
    console.log('Health check requested')
    return new Response(
      JSON.stringify({ status: 'ok', message: 'DeepSeek Edge Function is running' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  }

  try {
    // Parse request JSON
    const { message, context, model, maxTokens, temperature, apiKey } = await req.json()
    
    // Log request information (without API key)
    console.log('DeepSeek request:', { 
      messageLength: message?.length, 
      contextLength: context?.length,
      model, 
      maxTokens, 
      temperature
    })

    // Validate required fields
    if (!message) {
      throw new Error('Message is required')
    }
    
    if (!apiKey) {
      throw new Error('DeepSeek API key is required')
    }

    // Prepare the conversation history in the format DeepSeek expects
    const messages = context && context.length > 0 
      ? context
      : [{ role: 'user', content: message }]
    
    // If the last message isn't the current message, add it
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'user' || lastMsg.content !== message) {
      messages.push({ role: 'user', content: message })
    }

    // Default to deepseek-coder if model not specified
    const deepseekModel = model || 'deepseek-coder'
    
    // Prepare request to DeepSeek API
    const deepseekRequest = {
      model: deepseekModel,
      messages: messages,
      max_tokens: maxTokens || 1000,
      temperature: temperature || 0.7
    }

    console.log(`Making request to DeepSeek API with model: ${deepseekModel}`)
    
    // Make request to DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(deepseekRequest)
    })

    // Parse response from DeepSeek
    const data = await response.json()
    
    // Log response status
    console.log('DeepSeek API response status:', response.status)
    
    // Handle errors from the DeepSeek API
    if (!response.ok) {
      console.error('DeepSeek API error:', data)
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek API error: ${data.error?.message || 'Unknown error'}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status 
        }
      )
    }

    // Extract the response content from DeepSeek's response structure
    const responseText = data.choices && data.choices[0] 
      ? data.choices[0].message.content 
      : null

    if (!responseText) {
      throw new Error('No response content received from DeepSeek API')
    }

    // Log success (truncated for brevity)
    console.log('DeepSeek response received:', responseText.substring(0, 100) + '...')

    // Return the successful response
    return new Response(
      JSON.stringify({ response: responseText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    // Log and handle any errors that occur
    console.error('DeepSeek Edge Function error:', error.message)
    return new Response(
      JSON.stringify({ 
        error: `Error processing DeepSeek request: ${error.message}` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
