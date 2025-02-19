
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

    // Convert base64 to binary
    const audioBlob = Uint8Array.from(atob(audioData.split(',')[1]), c => c.charCodeAt(0))
    
    // Prepare form data for Whisper API
    const formData = new FormData()
    formData.append('file', new Blob([audioBlob], { type: 'audio/webm' }), 'audio.webm')
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
      throw new Error('Failed to transcribe audio')
    }

    const { text: transcription } = await whisperResponse.json()
    console.log('Transcription:', transcription)

    return new Response(
      JSON.stringify({ 
        transcription,
        audioResponse: null // Voor nu sturen we geen audio response terug
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-voice function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
