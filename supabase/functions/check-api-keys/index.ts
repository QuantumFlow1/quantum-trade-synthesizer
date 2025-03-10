
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
    const { service, checkSecret } = await req.json();
    
    console.log(`Checking API keys. Service: ${service}, checkSecret: ${checkSecret}`);
    
    // Check all keys
    const allKeys = {
      openai: !!OPENAI_API_KEY && OPENAI_API_KEY.length > 10,
      claude: !!CLAUDE_API_KEY && CLAUDE_API_KEY.length > 10,
      deepseek: !!DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 10,
      groq: !!GROQ_API_KEY && GROQ_API_KEY.length > 10,
      gemini: !!GEMINI_API_KEY && GEMINI_API_KEY.length > 10
    };
    
    console.log('API Keys availability:', {
      openai: allKeys.openai,
      claude: allKeys.claude,
      deepseek: allKeys.deepseek,
      groq: allKeys.groq,
      gemini: allKeys.gemini
    });
    
    // If checking a specific service
    if (service && service !== 'any') {
      let secretSet = false;
      
      // Check if the specific service has a key
      switch(service.toLowerCase()) {
        case 'openai':
          secretSet = allKeys.openai;
          break;
        case 'claude':
          secretSet = allKeys.claude;
          break;
        case 'deepseek':
          secretSet = allKeys.deepseek;
          break;
        case 'groq':
          secretSet = allKeys.groq;
          break;
        case 'gemini':
          secretSet = allKeys.gemini;
          break;
        default:
          console.log(`Unknown service: ${service}`);
      }
      
      return new Response(
        JSON.stringify({
          status: secretSet ? 'available' : 'unavailable',
          secretSet,
          service,
          allKeys,
          available: secretSet
        }),
        { headers: corsHeaders }
      );
    }
    
    // Check if any key is available
    const anyKeyAvailable = Object.values(allKeys).some(value => value);
    
    return new Response(
      JSON.stringify({
        status: anyKeyAvailable ? 'available' : 'unavailable',
        allKeys,
        available: anyKeyAvailable,
        message: anyKeyAvailable ? 'API keys are available' : 'No API keys are available'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error in check-api-keys function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
