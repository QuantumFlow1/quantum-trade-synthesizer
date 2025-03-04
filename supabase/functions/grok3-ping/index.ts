
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
    console.log('Grok3 ping: checking connection');
    
    // Get the API key from environment
    const key = Deno.env.get('GROK3_API_KEY');
    
    if (!key) {
      console.log('Grok3 ping: no API key available');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'No Grok3 API key configured' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
      // Simple request to Grok API to check if the API key is valid
      const response = await fetch('https://api.xai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Always check response.ok before trying to parse the JSON
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Grok3 API connection check failed:', response.status, response.statusText, errorBody);
        
        return new Response(
          JSON.stringify({ 
            status: 'unavailable', 
            message: `Connection failed: ${response.status} ${response.statusText}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Grok3 API connection successful');
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          message: 'Grok3 API connection successful' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Fetch error in grok3-ping function:', fetchError);
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: `Failed to connect to Grok3 API: ${fetchError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in grok3-ping function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An error occurred while checking connection' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
