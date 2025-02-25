
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import OpenAI from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { text, voiceId } = requestData

    console.log(`Processing TTS request for voice: ${voiceId}`)
    console.log(`Text to convert (first 100 chars): ${text.substring(0, 100)}...`)

    if (!text) {
      console.error('No text provided in request')
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Select the appropriate voice for OpenAI TTS
    let openaiVoice = 'alloy' // default
    
    // Map custom voice IDs to OpenAI voices
    if (voiceId && voiceId.includes('male')) {
      openaiVoice = 'echo'
    } else if (voiceId && voiceId.includes('female')) {
      openaiVoice = 'nova'
    } else if (voiceId === 'EdriziAI-info') {
      openaiVoice = 'fable' // Use a distinctive voice for EdriziAI
    }
    
    console.log(`Using OpenAI voice: ${openaiVoice}`)

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error (API key)' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    // Validate text length
    if (text.length > 4096) {
      console.warn('Text too long, truncating to 4096 characters')
      text = text.substring(0, 4096)
    }

    console.log('Sending request to OpenAI TTS API')
    
    // Generate speech from text
    try {
      const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: openaiVoice,
          response_format: 'mp3',
        }),
      })

      if (!speechResponse.ok) {
        const errorBody = await speechResponse.text()
        console.error(`OpenAI TTS API error (${speechResponse.status}):`, errorBody)
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to generate speech', 
            status: speechResponse.status,
            details: errorBody
          }),
          {
            status: speechResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      console.log('Successfully received audio data from OpenAI')
      
      // Convert audio buffer to base64
      const arrayBuffer = await speechResponse.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Convert to base64
      const base64Audio = btoa(
        Array.from(uint8Array)
          .map(byte => String.fromCharCode(byte))
          .join('')
      )
      
      console.log(`Generated audio data (size: ${Math.round(base64Audio.length / 1024)}KB)`)

      return new Response(
        JSON.stringify({ audioContent: base64Audio }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (openaiError) {
      console.error('OpenAI API call error:', openaiError)
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', details: openaiError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('General error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
