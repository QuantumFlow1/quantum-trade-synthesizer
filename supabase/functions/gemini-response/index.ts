
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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
      console.log('Gemini availability check received');
      return new Response(
        JSON.stringify({ response: 'pong', status: 'available' }),
        { headers: corsHeaders }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'GEMINI_API_KEY not configured',
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
    console.log('Received request for Gemini:', { message, contextLength: context?.length });

    // Format conversation history for Gemini
    const formattedContext = context?.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || [];

    // Add the current message
    const contents = [
      ...formattedContext,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Make request to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: `Gemini API request failed: ${response.status} ${response.statusText}`,
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
    console.log('Gemini API response received');
    
    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    return new Response(
      JSON.stringify({
        response: responseText,
        status: 'success'
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in gemini-response function:', error);
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
