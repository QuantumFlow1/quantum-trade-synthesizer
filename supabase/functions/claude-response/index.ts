
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
    
    // Extract parameters and validate
    const { messages, context, model, temperature, max_tokens, apiKey } = body;

    // Validate required parameters
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if ((!messages || !Array.isArray(messages) || messages.length === 0) && !context) {
      return new Response(
        JSON.stringify({ error: 'Either messages or context must be provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Claude API request for model: ${model || 'default'}`);
    if (messages) console.log(`Messages count: ${messages.length}`);
    if (context) console.log(`Context messages: ${context.length}`);

    // Format messages for Claude API
    const formattedMessages = messages || (context && Array.isArray(context) ? [...context] : []);

    if (!formattedMessages || formattedMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid messages could be parsed' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Ensure all messages have the required role and content properties
    const validMessages = formattedMessages.filter(msg => 
      msg && typeof msg === 'object' && 
      'role' in msg && 
      'content' in msg && 
      typeof msg.content === 'string' &&
      ['user', 'assistant'].includes(msg.role)
    );

    if (validMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid messages with proper format were provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
    console.log(`Messages being sent to Claude API: ${JSON.stringify(validMessages)}`);

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
        messages: validMessages,
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
      
      return new Response(
        JSON.stringify({ 
          error: `Claude API returned error: ${response.status} ${response.statusText}`,
          details: errorData
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
