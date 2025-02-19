
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioData } = await req.json()
    
    if (!audioData) {
      throw new Error('No audio data provided')
    }

    // Remove the data URL prefix if present
    const base64Data = audioData.includes('base64,') 
      ? audioData.split('base64,')[1] 
      : audioData

    // Prepare form data for Whisper API
    const formData = new FormData()
    const audioBlob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    // Send to Whisper API for transcription
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.text()
      console.error('Whisper API error:', errorData)
      throw new Error(`Whisper API error: ${errorData}`)
    }

    const { text: transcription } = await whisperResponse.json()
    console.log('Transcription received:', transcription)

    return new Response(
      JSON.stringify({ 
        transcription,
        audioResponse: null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-voice function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
