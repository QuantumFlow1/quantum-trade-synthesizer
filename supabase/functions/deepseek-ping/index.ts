
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

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
    
    // Use API key from request or fall back to environment variable
    const key = apiKey || DEEPSEEK_API_KEY;
    
    if (!key) {
      console.error('No DeepSeek API key provided');
      return new Response(
        JSON.stringify({ 
          available: false, 
          message: 'API key is required' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // Make a test request to DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return new Response(
        JSON.stringify({ 
          available: false, 
          message: `API error: ${errorText}` 
        }),
        { 
          status: response.status, 
          headers: corsHeaders 
        }
      );
    }
    
    const data = await response.json();
    console.log('DeepSeek API ping successful');
    
    return new Response(
      JSON.stringify({
        available: true,
        message: 'DeepSeek API is available',
        models: data.data?.length || 0
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in deepseek-ping function:', error);
    return new Response(
      JSON.stringify({ 
        available: false, 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
