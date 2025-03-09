
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
    // Parse the request body or use an empty object if it's not valid JSON
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      console.log("No valid JSON body provided");
    }
    
    const { service, checkSecret } = body;
    
    // Log incoming request
    console.log(`Checking API keys for service: ${service}, checkSecret: ${checkSecret}`);
    
    // Check if a specific service key was requested
    if (service) {
      // Map service name to environment variable name following common naming conventions
      const envVarMap: Record<string, string> = {
        'openai': 'OPENAI_API_KEY',
        'claude': 'CLAUDE_API_KEY',
        'gemini': 'GEMINI_API_KEY',
        'deepseek': 'DEEPSEEK_API_KEY',
        'groq': 'GROQ_API_KEY',
        'grok3': 'GROK3_API_KEY'
      };
      
      const envVarName = envVarMap[service.toLowerCase()];
      
      if (!envVarName) {
        return new Response(
          JSON.stringify({ error: `Unknown service: ${service}` }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Check if the secret should be validated
      if (checkSecret) {
        const secretValue = Deno.env.get(envVarName);
        const secretSet = !!secretValue && secretValue.trim().length > 0;
        
        console.log(`API key for ${service} (${envVarName}): ${secretSet ? 'SET' : 'NOT SET'}`);
        
        return new Response(
          JSON.stringify({ secretSet }),
          { headers: corsHeaders }
        );
      } else {
        // Just check if the variable exists
        const hasEnvVar = Deno.env.has(envVarName);
        
        console.log(`Environment variable ${envVarName} exists: ${hasEnvVar}`);
        
        return new Response(
          JSON.stringify({ exists: hasEnvVar }),
          { headers: corsHeaders }
        );
      }
    }
    
    // If no specific service was requested, check all services
    const services = ['openai', 'claude', 'gemini', 'deepseek', 'groq', 'grok3'];
    const results: Record<string, boolean> = {};
    
    for (const service of services) {
      const envVarName = `${service.toUpperCase()}_API_KEY`;
      const hasKey = Deno.env.has(envVarName);
      results[service] = hasKey;
    }
    
    console.log('API key availability check results:', results);
    
    return new Response(
      JSON.stringify({ keys: results }),
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
