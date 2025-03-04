
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
    console.log('DeepSeek ping: checking connection');
    
    // Get the API key from request or environment
    const requestData = await req.json().catch(() => ({ apiKey: null }));
    const key = requestData.apiKey || Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!key) {
      console.log('DeepSeek ping: no API key available');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'No DeepSeek API key configured' 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Basic validation of the API key format
    if (!key.startsWith('sk-')) {
      console.error('Invalid DeepSeek API key format');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'Invalid API key format. DeepSeek API keys should start with "sk-"' 
        }),
        { headers: corsHeaders }
      );
    }
    
    try {
      // Simple request to DeepSeek API to check if the API key is valid
      // Using fetch instead of direct database queries to avoid PREPARE statement issues
      const response = await fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Failed to read error response');
        console.error(`DeepSeek API connection check failed: ${response.status} ${response.statusText}`, errorText);
        
        // Check specifically for invalid API key (usually 401 Unauthorized)
        if (response.status === 401) {
          return new Response(
            JSON.stringify({ 
              status: 'unavailable', 
              message: 'Invalid API Key. Please check your DeepSeek API key and update it in the settings.' 
            }),
            { headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            status: 'unavailable', 
            message: `Connection failed: ${response.status} ${response.statusText}` 
          }),
          { headers: corsHeaders }
        );
      }
      
      console.log('DeepSeek API connection successful');
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          message: 'DeepSeek API connection successful' 
        }),
        { headers: corsHeaders }
      );
    } catch (fetchError) {
      console.error('Fetch error in deepseek-ping function:', fetchError);
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: `Failed to connect to DeepSeek API: ${fetchError.message}` 
        }),
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error in deepseek-ping function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An error occurred while checking connection' 
      }),
      { headers: corsHeaders }
    );
  }
});
