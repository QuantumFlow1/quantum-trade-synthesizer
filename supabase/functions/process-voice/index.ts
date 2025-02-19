
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
    const { audioData, voiceSettings } = await req.json()

    // 1. Convert speech to text using Whisper
    const formData = new FormData()
    const audioBlob = Uint8Array.from(atob(audioData.split(',')[1]), c => c.charCodeAt(0))
    formData.append('file', new Blob([audioBlob], { type: 'audio/webm' }), 'audio.webm')
    formData.append('model', 'whisper-1')

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

    // 2. Generate voice response using ElevenLabs
    const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transcription,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    if (!voiceResponse.ok) {
      throw new Error('Failed to generate voice response')
    }

    const audioBuffer = await voiceResponse.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    return new Response(
      JSON.stringify({ 
        transcription,
        audioResponse: `data:audio/mpeg;base64,${base64Audio}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
