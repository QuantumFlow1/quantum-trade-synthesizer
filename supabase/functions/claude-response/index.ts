
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

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
    // For availability checks, return a simple pong
    if (req.method === 'GET') {
      console.log('Claude availability check received');
      return new Response(
        JSON.stringify({ response: 'pong', status: 'available' }),
        { headers: corsHeaders }
      );
    }

    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'ANTHROPIC_API_KEY not configured',
          status: 'error' 
        }),
        { 
          status: 500,
          headers: corsHeaders 
        }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405,
          headers: corsHeaders 
        }
      );
    }

    // Parse request body
    const { message, context } = await req.json();
    console.log('Received request for Claude:', { message, contextLength: context?.length });

    // Prepare messages in Claude format
    const messages = [];
    if (context && context.length) {
      for (const msg of context) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }
    
    // Add the current message
    messages.push({
      role: 'user',
      content: message
    });

    // Make request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        messages: messages
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: `Claude API request failed: ${response.status} ${response.statusText}`,
          details: errorData,
          status: 'error'
        }),
        { 
          status: response.status,
          headers: corsHeaders 
        }
      );
    }

    const data = await response.json();
    console.log('Claude API response received');

    return new Response(
      JSON.stringify({
        response: data.content[0].text,
        status: 'success'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in claude-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error'
      }),
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
});
