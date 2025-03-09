
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('API ping function called');
    
    // Check if API keys are configured in environment
    const grok3ApiKey = Deno.env.get('GROK3_API_KEY');
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    // Check for client-provided Groq API key in header
    const clientGroqKey = req.headers.get('x-groq-api-key');
    
    const isGrok3Configured = !!grok3ApiKey && grok3ApiKey !== 'CHANGEME';
    const isGroqConfigured = !!(groqApiKey || clientGroqKey);
    
    const isConfigured = isGrok3Configured || isGroqConfigured;
    
    return new Response(
      JSON.stringify({
        status: isConfigured ? 'available' : 'unavailable',
        message: isConfigured 
          ? 'API is available'
          : 'API key not configured. Please set a Grok3 or Groq API key.',
        grok3Available: isGrok3Configured,
        groqAvailable: isGroqConfigured,
        timestamp: new Date().toISOString()
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in API ping:', error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200, // Still return 200 to avoid HTTP errors
        headers: corsHeaders
      }
    );
  }
});
