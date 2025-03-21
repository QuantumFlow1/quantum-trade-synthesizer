
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Helper to check if an API key is valid by making a minimal request to DeepSeek
async function checkDeepSeekApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking DeepSeek API key:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the provided API key or use the environment variable
    const { apiKey } = await req.json().catch(() => ({}));
    const key = apiKey || Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!key) {
      return new Response(
        JSON.stringify({
          status: 'unavailable',
          message: 'No DeepSeek API key provided'
        }),
        { headers: corsHeaders }
      );
    }
    
    // Test if the DeepSeek API key is valid
    const isValid = await checkDeepSeekApiKey(key);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({
          status: 'unavailable',
          message: 'Invalid DeepSeek API key or service unavailable'
        }),
        { headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({
        status: 'available',
        message: 'DeepSeek API is available'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in deepseek-ping function:', error);
    
    return new Response(
      JSON.stringify({
        status: 'unavailable',
        message: `Error: ${error.message}`
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
