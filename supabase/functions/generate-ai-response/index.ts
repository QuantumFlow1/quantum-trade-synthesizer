
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, history } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received message:', message);
    console.log('History length:', history?.length || 0);

    const configuration = new Configuration({
      apiKey: openAIApiKey,
    });
    
    const openai = new OpenAIApi(configuration);

    // Format the conversation history for OpenAI
    const messages = [
      { role: "system", content: "Je bent een behulpzame assistente die duidelijke en beknopte antwoorden geeft." },
    ];

    // Add conversation history if available
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }

    // Add the current user message
    messages.push({ role: "user", content: message });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantResponse = response.data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    console.log('Generated response:', assistantResponse.substring(0, 50) + '...');

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-response:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
