
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, context, model, maxTokens, temperature, apiKey } = await req.json();
    
    // Check if the API key is provided, otherwise use the environment variable
    const openAIApiKey = apiKey || Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not provided');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log request details (without sensitive info)
    console.log(`OpenAI request: model=${model}, temperature=${temperature}, maxTokens=${maxTokens}`);
    
    // Convert the conversation context to OpenAI format
    const messages = context.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
    
    // Add the new message from the user
    messages.push({ role: 'user', content: message });

    // Select the model to use
    const modelToUse = model === 'gpt-4' ? 'gpt-4o' : 
                       model === 'gpt-3.5-turbo' ? 'gpt-3.5-turbo' : 
                       model === 'openai' ? 'gpt-4o' : 'gpt-3.5-turbo';
    
    console.log(`Using OpenAI model: ${modelToUse}`);

    // Make the request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: messages,
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.7,
      }),
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API Error: ${errorData.error?.message || 'Unknown error'}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log(`OpenAI response generated (${generatedText.length} chars)`);

    return new Response(
      JSON.stringify({ response: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in OpenAI response function:', error);
    return new Response(
      JSON.stringify({ error: `Error processing request: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
