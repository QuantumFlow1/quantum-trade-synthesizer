
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/ogg'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GROK3_API_KEY');
    const isConfigured = !!apiKey && apiKey !== 'CHANGEME';

    // Get request body
    const body = await req.json();
    const { checkVideoFormats } = body || {};

    const response = {
      status: isConfigured ? 'available' : 'unavailable',
      timestamp: new Date().toISOString(),
      configured: isConfigured,
      version: '3.0.1',
      supportedFormats: {
        text: ['text/plain', 'application/json'],
        audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
        image: ['image/jpeg', 'image/png', 'image/webp'],
        video: checkVideoFormats ? SUPPORTED_VIDEO_FORMATS : undefined
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in grok3-ping:', error);

    return new Response(JSON.stringify({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
