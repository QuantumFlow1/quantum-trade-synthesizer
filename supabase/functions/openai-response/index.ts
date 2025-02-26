
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
    }

    const requestData = await req.json();
    const { message, context = [], options = {} } = requestData;
    
    const temperature = options.temperature || 0.7;
    const maxTokens = options.maxTokens || 1024;
    
    console.log('OpenAI Request:', {
      messageLength: message?.length,
      contextLength: context?.length,
      temperature,
      maxTokens,
    });

    // Format the conversation history and user message
    let messages = [];
    
    // Add system message for context
    messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant that provides clear, accurate, and useful information.'
    });
    
    // Add conversation history if it exists
    if (Array.isArray(context) && context.length > 0) {
      messages = [...messages, ...context];
    }
    
    // Add the user's current message if not already in context
    if (message && (context.length === 0 || context[context.length - 1]?.role !== 'user')) {
      messages.push({
        role: 'user',
        content: message
      });
    }

    console.log(`Making request to OpenAI API with ${messages.length} messages`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', result);
      throw new Error(`OpenAI API error: ${result.error?.message || JSON.stringify(result)}`);
    }
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error('No response from OpenAI API');
    }
    
    const generatedText = result.choices[0].message.content;
    console.log('OpenAI response received, length:', generatedText.length);

    return new Response(JSON.stringify({ 
      generatedText,
      model: result.model,
      usage: result.usage,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in openai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unknown error occurred',
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
