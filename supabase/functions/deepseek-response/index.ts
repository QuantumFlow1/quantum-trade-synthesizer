
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
    const deepSeekApiKey = apiKey || Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!deepSeekApiKey) {
      console.error('DeepSeek API key not provided');
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key not provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log request details (without sensitive info)
    console.log(`DeepSeek request: model=${model}, temperature=${temperature}, maxTokens=${maxTokens}`);
    
    // Convert the conversation context to DeepSeek format
    const messages = context.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
    
    // Add the new message from the user
    messages.push({ role: 'user', content: message });

    // Select the model to use (DeepSeek-Coder is the default)
    const modelToUse = model === 'deepseek-chat' ? 'deepseek-chat' : 'deepseek-coder';
    
    console.log(`Using DeepSeek model: ${modelToUse}`);

    // Make the request to DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepSeekApiKey}`,
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
      console.error('DeepSeek API error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: `DeepSeek API Error: ${errorData.error?.message || 'Unknown error'}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log(`DeepSeek response generated (${generatedText.length} chars)`);

    return new Response(
      JSON.stringify({ response: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in DeepSeek response function:', error);
    return new Response(
      JSON.stringify({ error: `Error processing request: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
