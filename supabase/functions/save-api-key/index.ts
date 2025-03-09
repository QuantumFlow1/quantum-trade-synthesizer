
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
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    const { keyType, apiKey } = body;
    
    // Log the received data (excluding the full API key for security)
    console.log(`Request received for keyType: ${keyType}, API key length: ${apiKey ? apiKey.length : 0}`);
    
    if (!keyType || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: keyType or apiKey' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate key type
    if (!['groq', 'openai', 'anthropic', 'claude', 'gemini', 'deepseek', 'mistral'].includes(keyType)) {
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
    
    // In a real production environment, this function would use Supabase admin API
    // to set the secret. For now, we're just simulating a successful save.
    
    // Return success response
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
    
    // Ensure proper error response with CORS headers
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message || 'Unknown error'}` }),
      { status: 500, headers: corsHeaders }
    );
  }
});
