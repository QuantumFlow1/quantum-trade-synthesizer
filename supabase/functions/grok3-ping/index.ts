
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Grok3 API availability check started');
    
    // Check if the environment has the Grok3 API key set
    const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY');
    
    if (!GROK3_API_KEY) {
      console.log('No Grok3 API key found in environment variables');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'Grok3 API key not configured in server environment' 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Check if this is just an availability check, in which case we don't need to make an actual API call
    const { isAvailabilityCheck = true, testApiCall = false } = await req.json().catch(() => ({ isAvailabilityCheck: true }));
    
    // If testApiCall is true, we'll explicitly test the API key
    if (testApiCall || !isAvailabilityCheck) {
      console.log('Performing explicit API key validation test');
      // Simple test request to Grok3 API
      try {
        const response = await fetch('https://api.xai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${GROK3_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Failed to read error response');
          console.error(`Grok3 API test request failed: ${response.status} ${response.statusText}`, errorText);
          
          // Check specifically for invalid API key (usually 401 Unauthorized)
          if (response.status === 401) {
            return new Response(
              JSON.stringify({ 
                status: 'unavailable', 
                message: 'Invalid API Key. Please check your Grok3 API key and update it in the settings.' 
              }),
              { headers: corsHeaders }
            );
          }
          
          return new Response(
            JSON.stringify({ 
              status: 'unavailable', 
              message: `API test failed: ${response.status} ${response.statusText}` 
            }),
            { headers: corsHeaders }
          );
        }
        
        console.log('Grok3 API test request successful');
        return new Response(
          JSON.stringify({ 
            status: 'available', 
            message: 'Grok3 API connection successful' 
          }),
          { headers: corsHeaders }
        );
      } catch (fetchError) {
        console.error('Error testing Grok3 API connection:', fetchError);
        return new Response(
          JSON.stringify({ 
            status: 'unavailable', 
            message: `Failed to connect to Grok3 API: ${fetchError.message}` 
          }),
          { headers: corsHeaders }
        );
      }
    }
    
    // For simple availability checks, just verify the API key exists
    console.log('Simple availability check - API key exists');
    return new Response(
      JSON.stringify({ 
        status: 'available', 
        message: 'Grok3 API key is configured' 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in grok3-ping function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An error occurred during API availability check' 
      }),
      { headers: corsHeaders }
    );
  }
});
