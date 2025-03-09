
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  console.log('Checking API keys availability');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract parameters from request body
    const requestData = await req.json();
    const { service } = requestData || {};
    const checkSecret = requestData?.checkSecret === true;
    
    console.log(`Checking availability for service: ${service}, checkSecret: ${checkSecret}`);

    // Get all available API keys
    const allKeys = {
      openai: !!Deno.env.get('OPENAI_API_KEY'),
      claude: !!Deno.env.get('CLAUDE_API_KEY'),
      gemini: !!Deno.env.get('GEMINI_API_KEY'),
      grok3: !!Deno.env.get('GROK3_API_KEY'),
      groq: !!Deno.env.get('GROQ_API_KEY'),
      deepseek: !!Deno.env.get('DEEPSEEK_API_KEY')
    };
    
    // If we're checking a specific service, validate the corresponding secret
    if (service && checkSecret) {
      let secretKey = null;
      let provider = service.toLowerCase();
      
      switch (provider) {
        case 'openai':
          secretKey = Deno.env.get('OPENAI_API_KEY');
          break;
        case 'claude':
          secretKey = Deno.env.get('CLAUDE_API_KEY');
          break;
        case 'gemini':
          secretKey = Deno.env.get('GEMINI_API_KEY');
          break;
        case 'grok3':
          secretKey = Deno.env.get('GROK3_API_KEY');
          break;
        case 'groq':
          secretKey = Deno.env.get('GROQ_API_KEY');
          break;
        case 'deepseek':
          secretKey = Deno.env.get('DEEPSEEK_API_KEY');
          break;
        case 'any':
          // If service is 'any', check if any API key is available
          secretKey = Deno.env.get('OPENAI_API_KEY') || 
                      Deno.env.get('CLAUDE_API_KEY') || 
                      Deno.env.get('GEMINI_API_KEY') ||
                      Deno.env.get('GROK3_API_KEY') ||
                      Deno.env.get('GROQ_API_KEY') ||
                      Deno.env.get('DEEPSEEK_API_KEY');
          break;
        default:
          // Default to checking all API keys
          secretKey = Deno.env.get('OPENAI_API_KEY') || 
                      Deno.env.get('CLAUDE_API_KEY') || 
                      Deno.env.get('GEMINI_API_KEY') ||
                      Deno.env.get('GROK3_API_KEY') ||
                      Deno.env.get('GROQ_API_KEY') ||
                      Deno.env.get('DEEPSEEK_API_KEY');
      }
      
      // Additional debug log
      const secretSet = !!secretKey;
      console.log(`Service ${service} secret is ${secretSet ? 'set' : 'not set'}`);
      
      // Return comprehensive information about available keys
      return new Response(
        JSON.stringify({ 
          status: 'success', 
          secretSet,
          service,
          allKeys,
          requestedProvider: provider,
          timestamp: new Date().getTime()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no specific check was requested, provide info on all available keys
    // Check if any key is available
    const anyKeyAvailable = Object.values(allKeys).some(value => value === true);
    
    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'API key check completed',
        available: anyKeyAvailable,
        allKeys,
        timestamp: new Date().getTime()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-api-keys function:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: `API key check failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().getTime()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
