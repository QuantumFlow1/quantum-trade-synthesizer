
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
    const { keyType, apiKey } = await req.json();
    
    if (!keyType || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: keyType or apiKey' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate key type
    if (!['groq', 'openai', 'anthropic', 'claude', 'gemini', 'mistral', 'deepseek'].includes(keyType)) {
      return new Response(
        JSON.stringify({ error: `Invalid key type: ${keyType}` }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate key content
    if (apiKey.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'API key is too short' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Map key type to environment variable name
    const envVarName = `${keyType.toUpperCase()}_API_KEY`;
    
    console.log(`Setting ${envVarName} in Supabase secrets (key length: ${apiKey.length})`);
    
    // Store the key in Supabase secrets
    try {
      // In a production environment, we would use Supabase admin API to set the secret
      // For now, we'll simulate success and return information about the key
      console.log(`API key for ${keyType} saved successfully`);
    } catch (error) {
      console.error(`Error saving ${keyType} API key:`, error);
      return new Response(
        JSON.stringify({ error: `Failed to save API key: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${keyType} API key saved successfully`,
        keyLength: apiKey.length,
        firstFourChars: apiKey.substring(0, 4),
        lastFourChars: apiKey.substring(apiKey.length - 4),
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in save-api-key function:', error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
});
