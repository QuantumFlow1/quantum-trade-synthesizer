
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

  try {
    const { message, context = [], model = 'deepseek-coder', maxTokens = 1024, temperature = 0.7, apiKey } = await req.json();
    
    // Use the provided API key or fallback to environment variable
    const deepseekApiKey = apiKey || Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!deepseekApiKey) {
      console.error('DeepSeek API key is missing');
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key is required. Please provide it in your settings.' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing DeepSeek request with model: ${model}`);
    
    // Format the messages for DeepSeek API format
    const messages = [
      ...context.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // DeepSeek API endpoint
    const endpoint = model.includes('chat') 
      ? 'https://api.deepseek.com/v1/chat/completions' 
      : 'https://api.deepseek.com/v1/completions';

    console.log(`Using DeepSeek endpoint: ${endpoint}`);
    
    // Make request to DeepSeek API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: model.includes('chat') ? 'deepseek-chat' : 'deepseek-coder',
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepSeek API Error:', errorData);
      throw new Error(`DeepSeek API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('DeepSeek response received', data);
    
    // Extract the response text
    const responseText = data.choices[0]?.message?.content || data.choices[0]?.text || '';
    
    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in DeepSeek function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
