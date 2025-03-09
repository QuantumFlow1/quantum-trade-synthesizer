
// Import necessary modules for Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error("Invalid request body: " + e.message);
    }
    
    const { message, context, model, temperature, max_tokens, apiKey } = body;

    if (!message && (!context || context.length === 0)) {
      throw new Error('Either message or context must be provided');
    }

    if (!apiKey) {
      throw new Error('API key is required');
    }

    console.log(`Claude API request for model: ${model || 'default'}`);
    if (message) console.log(`Message content length: ${message.length}`);
    if (context) console.log(`Context messages: ${context.length}`);

    // Format messages for Claude API
    const messages = context && Array.isArray(context) ? [...context] : [];

    // Add the latest user message if not already included in context
    if (message && !messages.some(msg => msg.content === message && msg.role === 'user')) {
      messages.push({
        role: 'user',
        content: message
      });
    }

    // Determine which Claude API model to use
    const claudeModel = model === 'claude' || model === 'claude-3-haiku' 
      ? 'claude-3-haiku-20240307' 
      : model === 'claude-3-sonnet' 
        ? 'claude-3-sonnet-20240229' 
        : model === 'claude-3-opus' 
          ? 'claude-3-opus-20240229' 
          : 'claude-3-haiku-20240307';

    console.log(`Using Claude model: ${claudeModel}`);

    // Make API request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claudeModel,
        messages: messages,
        max_tokens: max_tokens || 1024,
        temperature: temperature || 0.7
      })
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API returned error: ${response.status} ${response.statusText}`);
    }

    // Parse the response data
    const data = await response.json();
    console.log('Claude response received successfully');

    // Return the Claude API response
    return new Response(JSON.stringify({ 
      response: data.content[0].text,
      model: claudeModel
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in Claude function:', error.message);
    
    // Return an error response
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
