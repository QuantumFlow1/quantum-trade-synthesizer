
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
    const { audioUrl } = await req.json()
    
    if (!audioUrl) {
      throw new Error('No audio URL received')
    }

    console.log('Received audio for processing')

    // Fetch the audio data from the URL
    let audioData
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`)
      }
      const blob = await response.blob()
      
      // Convert blob to base64
      const arrayBuffer = await blob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      audioData = btoa(binaryString)
      
      console.log(`Successfully fetched and encoded audio (${arrayBuffer.byteLength} bytes)`)
    } catch (error) {
      console.error('Error fetching or processing audio URL:', error)
      throw new Error(`Error processing audio: ${error.message}`)
    }

    // Prepare form data for Whisper API
    const formData = new FormData()
    
    // Convert base64 back to blob for the API request
    const byteString = atob(audioData)
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const audioBlob = new Blob([ab], { type: 'audio/webm' })
    
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'nl')

    console.log('Sending audio to OpenAI Whisper API')

    // Send to OpenAI Whisper API for transcription
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
      JSON.stringify({ transcription }),
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
