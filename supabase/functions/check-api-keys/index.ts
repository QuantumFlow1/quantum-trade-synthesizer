
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

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
    
    console.log(`Checking availability for: ${service}`);
    let available = false;
    let secretSet = false;
    
    // Check if any API key is available
    if (service === 'any') {
      secretSet = !!(GROK3_API_KEY || OPENAI_API_KEY || CLAUDE_API_KEY || GEMINI_API_KEY || DEEPSEEK_API_KEY);
      
      return new Response(
        JSON.stringify({ 
          available: false, // We're just checking for secrets, not actual availability
          secretSet,
          keys: {
            grok3: !!GROK3_API_KEY,
            openai: !!OPENAI_API_KEY,
            claude: !!CLAUDE_API_KEY,
            gemini: !!GEMINI_API_KEY,
            deepseek: !!DEEPSEEK_API_KEY
          }
        }),
        { headers: corsHeaders }
      );
    }
    
    if (service === 'grok3') {
      // First check if the secret is set
      secretSet = !!GROK3_API_KEY;
      
      // If only checking for secret status and not actual API availability
      if (checkSecret) {
        return new Response(
          JSON.stringify({ 
            available: false,
            secretSet
          }),
          { headers: corsHeaders }
        );
      }
      
      // If the API key is set, test if it actually works
      if (secretSet) {
        try {
          // Simple test call to check if the API is responsive
          const testResponse = await fetch('https://api.xai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROK3_API_KEY}`
            },
            body: JSON.stringify({
              model: "grok-3",
              messages: [
                {
                  role: "system",
                  content: "You are a helpful assistant."
                },
                {
                  role: "user",
                  content: "Say hello, this is an API test"
                }
              ],
              temperature: 0.7,
              max_tokens: 10
            })
          });
          
          const responseData = await testResponse.json();
          
          // Check if we got a valid response
          if (responseData && !responseData.error) {
            available = true;
            console.log("Grok3 API test successful");
          } else {
            console.log("Grok3 API test failed:", responseData.error || "Unknown error");
          }
        } catch (apiError) {
          console.error("Error testing Grok3 API:", apiError);
          available = false;
        }
      } else {
        console.log("Grok3 API key not set in secrets");
        available = false;
      }
    } else if (service === 'openai') {
      // Check if OpenAI API key is set
      secretSet = !!OPENAI_API_KEY;
      
      // Perform similar checks for OpenAI if needed
      // This is a placeholder for future OpenAI API validation
      available = secretSet;
    } else if (service === 'claude') {
      secretSet = !!CLAUDE_API_KEY;
      available = secretSet;
    } else if (service === 'gemini') {
      secretSet = !!GEMINI_API_KEY;
      available = secretSet;
    } else if (service === 'deepseek') {
      secretSet = !!DEEPSEEK_API_KEY;
      available = secretSet;
    }
    
    // Return the availability status
    return new Response(
      JSON.stringify({ 
        available,
        secretSet
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
