
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const base64Data = base64String.split(',')[1]; // Remove data URL prefix
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64Data.length) {
    const chunk = base64Data.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
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

    console.log('Received audio data length:', audioData.length);

    // Process audio in chunks
    const audioBlob = processBase64Chunks(audioData);
    console.log('Processed audio blob size:', audioBlob.length);
    
    // Prepare form data for Whisper API
    const formData = new FormData()
    formData.append('file', new Blob([audioBlob], { type: 'audio/webm' }), 'audio.webm')
    formData.append('model', 'whisper-1')

    console.log('Sending request to Whisper API...');

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
