
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    const { messages, model, temperature, max_tokens, apiKey } = await req.json();
    
    console.log(`OpenAI API request with ${messages.length} messages using model: ${model}`);
    
    // Use API key from request or fall back to environment variable
    const key = apiKey || OPENAI_API_KEY;
    
    if (!key) {
      console.error('No OpenAI API key provided');
      return new Response(
        JSON.stringify({ 
          error: 'API key is required' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // Default parameters
    const modelToUse = model || 'gpt-4o';
    const temp = temperature || 0.7;
    const maxTokens = max_tokens || 1024;
    
    console.log(`Using model: ${modelToUse}, temperature: ${temp}, max_tokens: ${maxTokens}`);
    
    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: messages,
        temperature: temp,
        max_tokens: maxTokens
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `API error: ${errorText}` 
        }),
        { 
          status: response.status, 
          headers: corsHeaders 
        }
      );
    }
    
    const data = await response.json();
    console.log('OpenAI API response received');
    
    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in openai-response function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
