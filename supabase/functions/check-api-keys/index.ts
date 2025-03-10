
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
    // Get request details
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      console.log('No request body or malformed JSON');
    }
    
    const { service = 'any', checkSecret = false } = body;
    
    console.log(`Checking API keys for service: ${service}`);
    
    // Get all the API keys from environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    // Check if specific keys are set
    const hasOpenAI = !!OPENAI_API_KEY && OPENAI_API_KEY.length > 10;
    const hasClaude = !!CLAUDE_API_KEY && CLAUDE_API_KEY.length > 10;
    const hasGemini = !!GEMINI_API_KEY && GEMINI_API_KEY.length > 10;
    const hasDeepseek = !!DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 10;
    const hasGroq = !!GROQ_API_KEY && GROQ_API_KEY.length > 10;
    
    // Create a collection of all keys
    const allKeys = {
      openai: hasOpenAI,
      claude: hasClaude,
      gemini: hasGemini,
      deepseek: hasDeepseek,
      groq: hasGroq
    };
    
    // If checking a specific service
    if (service !== 'any') {
      let available = false;
      
      switch(service.toLowerCase()) {
        case 'openai':
          available = hasOpenAI;
          break;
        case 'claude':
          available = hasClaude;
          break;
        case 'gemini':
          available = hasGemini;
          break;
        case 'deepseek':
          available = hasDeepseek;
          break;
        case 'groq':
          available = hasGroq;
          break;
        default:
          console.log(`Unknown service: ${service}`);
      }
      
      return new Response(
        JSON.stringify({
          status: 'success',
          service,
          available,
          allKeys
        }),
        { headers: corsHeaders }
      );
    }
    
    // If checking all services
    const anyAvailable = hasOpenAI || hasClaude || hasGemini || hasDeepseek || hasGroq;
    
    return new Response(
      JSON.stringify({
        status: 'success',
        available: anyAvailable,
        allKeys
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error checking API keys:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
