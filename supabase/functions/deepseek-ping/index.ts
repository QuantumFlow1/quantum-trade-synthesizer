
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    // Parse the request body
    const { apiKey } = await req.json();
    
    console.log('Checking DeepSeek API availability');
    
    if (!apiKey) {
      console.log('No API key provided for DeepSeek ping');
      return new Response(
        JSON.stringify({ 
          available: false,
          message: 'API key is required'
        }),
        { headers: corsHeaders }
      );
    }
    
    // Simple test call to check if the DeepSeek API is responsive
    try {
      // Use a lightweight request to check availability
      const response = await fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('DeepSeek API is available');
        return new Response(
          JSON.stringify({ 
            available: true 
          }),
          { headers: corsHeaders }
        );
      } else {
        const errorText = await response.text();
        console.error('DeepSeek API is not available:', errorText);
        return new Response(
          JSON.stringify({ 
            available: false,
            message: `API error: ${errorText}`
          }),
          { headers: corsHeaders }
        );
      }
    } catch (error) {
      console.error('Error checking DeepSeek API:', error);
      return new Response(
        JSON.stringify({ 
          available: false,
          message: `Error: ${error.message}`
        }),
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error(`Error in deepseek-ping function:`, error);
    return new Response(
      JSON.stringify({ 
        available: false,
        message: `Server error: ${error.message}`
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
