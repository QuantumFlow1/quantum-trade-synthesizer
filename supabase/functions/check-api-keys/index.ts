
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { service } = await req.json();
    console.log('Checking availability for:', service);

    if (service === 'grok3') {
      // Check if GROK3_API_KEY is set
      const grok3ApiKey = Deno.env.get('GROK3_API_KEY');
      
      if (!grok3ApiKey) {
        console.log('GROK3_API_KEY is not set');
        return new Response(
          JSON.stringify({ available: false, reason: 'API key not configured' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate the key by making a simple test request to the Grok3 API
      try {
        const testResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${grok3ApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: 'Hello, are you available?' }
            ],
            max_tokens: 10,
          }),
        });
        
        if (testResponse.ok) {
          console.log('Grok3 API key is valid');
          return new Response(
            JSON.stringify({ available: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          const errorData = await testResponse.json();
          console.error('Grok3 API key validation failed:', errorData);
          return new Response(
            JSON.stringify({ available: false, reason: 'API key validation failed', details: errorData }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.error('Error validating Grok3 API key:', error);
        return new Response(
          JSON.stringify({ available: false, reason: 'API connection error', details: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown service: ${service}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in check-api-keys:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
