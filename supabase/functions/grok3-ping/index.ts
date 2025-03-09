
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Grok3 ping function called');
    
    // Check if API key is configured in environment
    const apiKey = Deno.env.get('GROK3_API_KEY');
    const isConfigured = !!apiKey && apiKey !== 'CHANGEME';
    
    return new Response(
      JSON.stringify({
        status: isConfigured ? 'available' : 'unavailable',
        message: isConfigured ? 'Grok3 API is available' : 'Grok3 API key not configured',
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in grok3-ping:', error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
