
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');

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

    if (!CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'CLAUDE_API_KEY not configured',
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

    // Format messages for Claude API
    const messages = [
      ...(context || []).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Make request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: messages,
        max_tokens: 500
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
        response: data.content?.[0]?.text || "No response from Claude",
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
