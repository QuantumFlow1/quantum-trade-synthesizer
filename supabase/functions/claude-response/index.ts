
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // For health checks
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'available', message: 'Claude API is ready' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, context = [], model = 'claude-3-haiku', maxTokens = 1024, temperature = 0.7, apiKey } = await req.json();
    
    // Use the provided API key or fallback to environment variable
    const claudeApiKey = apiKey || Deno.env.get('CLAUDE_API_KEY');
    
    if (!claudeApiKey) {
      console.error('Claude API key is missing');
      return new Response(
        JSON.stringify({ error: 'Claude API key is required. Please provide it in your settings.' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing Claude request with model: ${model}`);
    
    // Format messages for Claude API
    const messages = context.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the current message
    messages.push({
      role: 'user',
      content: message
    });

    // Claude API endpoint
    const endpoint = 'https://api.anthropic.com/v1/messages';

    console.log(`Using Claude endpoint: ${endpoint}`);
    
    // Make request to Claude API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Claude response received:', data);
    
    // Extract the response text
    const responseText = data.content?.[0]?.text || '';
    
    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in Claude function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
