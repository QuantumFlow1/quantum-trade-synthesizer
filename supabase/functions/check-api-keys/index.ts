
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
    const { keyType } = await req.json();
    
    if (!keyType) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: keyType' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate key type
    if (!['groq', 'openai', 'anthropic', 'mistral'].includes(keyType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid key type' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Map key type to environment variable name
    const envVarName = `${keyType.toUpperCase()}_API_KEY`;
    
    // Check if the environment variable exists
    const hasKey = !!Deno.env.get(envVarName);
    
    return new Response(
      JSON.stringify({ hasKey }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in check-api-keys function:', error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
});
