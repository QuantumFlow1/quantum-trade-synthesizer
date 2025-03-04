
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
      JSON.stringify({ status: 'available', message: 'Grok3 API is ready' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, context = [] } = await req.json();
    
    // Get the API key from the environment variable
    const apiKey = Deno.env.get('GROK3_API_KEY');
    
    if (!apiKey) {
      console.error('Grok3 API key is not set in the environment variables');
      return new Response(
        JSON.stringify({ error: 'API key is missing. Please configure GROK3_API_KEY in the Supabase dashboard.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing Grok3 request with context length:', context.length);
    
    // Format messages for Grok3 API
    const formattedMessages = [
      ...context,
      { role: 'user', content: message }
    ];

    // Call the Grok3 API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768', // Using Mixtral model via Groq
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Grok3 API:', errorData);
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Grok3 API response received:', data);
    
    const responseText = data.choices[0]?.message?.content || '';
    
    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in Grok3 function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
