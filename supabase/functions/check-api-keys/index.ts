
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking API keys availability');
    
    // Extract parameters from request body
    const requestData = await req.json();
    const { service } = requestData || {};
    const checkSecret = requestData?.checkSecret === true;
    
    console.log(`Checking availability for service: ${service}, checkSecret: ${checkSecret}`);

    // If we're checking a specific service, validate the corresponding secret
    if (service && checkSecret) {
      let secretKey = null;
      switch (service.toLowerCase()) {
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
          // If service not specified, check if any API key is available
          secretKey = Deno.env.get('OPENAI_API_KEY') || 
                      Deno.env.get('CLAUDE_API_KEY') || 
                      Deno.env.get('GEMINI_API_KEY') ||
                      Deno.env.get('GROK3_API_KEY') ||
                      Deno.env.get('GROQ_API_KEY') ||
                      Deno.env.get('DEEPSEEK_API_KEY');
          break;
        default:
          // Check if any API key is available
          secretKey = Deno.env.get('OPENAI_API_KEY') || 
                      Deno.env.get('CLAUDE_API_KEY') || 
                      Deno.env.get('GEMINI_API_KEY') ||
                      Deno.env.get('GROK3_API_KEY') ||
                      Deno.env.get('GROQ_API_KEY') ||
                      Deno.env.get('DEEPSEEK_API_KEY');
      }
      
      const secretSet = !!secretKey;
      console.log(`Service ${service} secret is ${secretSet ? 'set' : 'not set'}`);
      
      return new Response(
        JSON.stringify({ 
          status: 'success', 
          secretSet, 
          service
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Default response when no specific check was requested
    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'API key check completed',
        available: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-api-keys function:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: `API key check failed: ${error.message}`,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
