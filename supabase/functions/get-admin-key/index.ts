
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables for the API keys
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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
    const { provider } = await req.json();
    
    console.log(`Getting admin key for provider: ${provider}`);
    let key = null;
    
    // Return the corresponding API key
    switch(provider) {
      case 'openai':
        key = OPENAI_API_KEY;
        break;
      case 'claude':
        key = CLAUDE_API_KEY;
        break;
      case 'deepseek':
        key = DEEPSEEK_API_KEY;
        break;
      case 'groq':
        key = GROQ_API_KEY;
        break;
      case 'gemini':
        key = GEMINI_API_KEY;
        break;
      default:
        console.log(`Unknown provider: ${provider}`);
    }
    
    // Only return the key if it exists
    if (key) {
      // Log partial key for debugging (securely)
      const maskedKey = key.substring(0, 4) + '...' + key.substring(key.length - 4);
      console.log(`Admin key for ${provider} found: ${maskedKey}`);
      return new Response(
        JSON.stringify({ key }),
        { headers: corsHeaders }
      );
    } else {
      console.log(`No admin key found for ${provider}`);
      return new Response(
        JSON.stringify({ error: `No admin key found for ${provider}` }),
        { status: 404, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error(`Error in get-admin-key function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
