
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('DeepSeek ping: checking connection');
    
    // Get the API key from environment variable or request
    const key = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!key) {
      console.log('DeepSeek ping: no API key available');
      return new Response(
        JSON.stringify({ status: 'unavailable', message: 'No DeepSeek API key configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Simple request to DeepSeek API to check if the API key is valid
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('DeepSeek API connection check failed:', response.statusText);
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: `Connection failed: ${response.statusText}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('DeepSeek API connection successful');
    return new Response(
      JSON.stringify({ 
        status: 'available', 
        message: 'DeepSeek API connection successful' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in deepseek-ping function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An error occurred while checking connection' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
