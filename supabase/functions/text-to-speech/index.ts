
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    if (!voiceId) {
      throw new Error('Voice ID is required')
    }

    console.log(`Processing text-to-speech for text length: ${text.length}, using voice ID: ${voiceId}`)

    // Check if text is too long and trim if necessary (ElevenLabs has limits)
    const maxTextLength = 4000
    let processedText = text
    if (text.length > maxTextLength) {
      console.log(`Text exceeds maximum length. Trimming from ${text.length} to ${maxTextLength} characters`)
      processedText = text.substring(0, maxTextLength) + "... (text truncated due to length)"
    }

    // ElevenLabs API call for text-to-speech
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: processedText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`ElevenLabs API error (${response.status}):`, errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(`ElevenLabs API error: ${JSON.stringify(errorData)}`)
      } catch (e) {
        throw new Error(`ElevenLabs API error: ${errorText}`)
      }
    }

    // Audio buffer to base64 conversion
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    
    console.log(`Successfully generated audio with size: ${arrayBuffer.byteLength} bytes`)

    return new Response(
      JSON.stringify({ 
        audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
        textLength: processedText.length,
        audioSize: arrayBuffer.byteLength
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Text-to-speech error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
