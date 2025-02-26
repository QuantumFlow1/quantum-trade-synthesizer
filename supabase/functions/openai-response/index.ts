
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('OpenAI response function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OPENAI_API_KEY is not set in the environment variables');
    }

    // Parse the request body
    const { message, context, options } = await req.json();
    
    console.log('Request received:', { 
      message: message?.substring(0, 50) + '...',  
      contextLength: context?.length || 0,
      options
    });

    // Prepare messages for OpenAI API
    let messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant that provides clear, concise, and accurate information.',
    });

    // Add conversation history if available
    if (context && Array.isArray(context)) {
      messages = [...messages, ...context];
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: message,
    });

    console.log('Sending request to OpenAI API with messages:', messages.length);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response choices returned from OpenAI API');
    }

    const responseContent = data.choices[0].message.content;
    console.log('Response content:', responseContent?.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({
        response: responseContent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in openai-response function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
