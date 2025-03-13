
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key, x-openai-api-key',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract API keys from headers or env vars
    const groqApiKey = req.headers.get('x-groq-api-key') || Deno.env.get('GROQ_API_KEY');
    const openaiApiKey = req.headers.get('x-openai-api-key') || Deno.env.get('OPENAI_API_KEY');
    
    if (!groqApiKey && !openaiApiKey) {
      console.error("No API key provided for agent communication");
      return new Response(
        JSON.stringify({
          status: 'error',
          error: 'API key is required for agent communication'
        }),
        { 
          status: 401, 
          headers: corsHeaders 
        }
      );
    }
    
    // Parse the request body
    const { agentId, agentType, message, systemPrompt, history = [] } = await req.json();
    
    if (!message) {
      console.error("No message provided for agent communication");
      return new Response(
        JSON.stringify({
          status: 'error',
          error: 'Message is required'
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    console.log(`Processing agent communication request for ${agentId} (${agentType})`);
    
    // Determine which API to use (prefer Groq if available)
    const useGroq = !!groqApiKey;
    const apiUrl = useGroq 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    
    const apiKey = useGroq ? groqApiKey : openaiApiKey;
    const model = useGroq ? "llama-3.1-70b-versatile" : "gpt-4o-mini";
    
    // Create default system prompt if none provided
    const defaultSystemPrompt = `You are ${agentId}, a ${agentType} AI agent specializing in financial markets.
    When communicating with users:
    1. Stay focused on financial topics and market analysis
    2. Provide detailed explanations backed by data when possible
    3. Maintain a professional, helpful tone
    4. If asked about specific stocks or assets, provide balanced analysis
    The current date is ${new Date().toLocaleDateString()}.`;
    
    // Prepare messages for the API
    const messages = [
      { role: "system", content: systemPrompt || defaultSystemPrompt },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];
    
    // Call the API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    // Check for errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`API error (${response.status}):`, errorData);
      
      return new Response(
        JSON.stringify({
          status: 'error',
          error: `API error: ${response.status} ${response.statusText}`,
          details: errorData
        }),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      );
    }
    
    // Parse the response
    const data = await response.json();
    const agentResponse = data.choices[0].message.content;
    
    console.log(`Successfully generated agent response for ${agentId}`);
    
    return new Response(
      JSON.stringify({
        status: 'success',
        response: agentResponse
      }),
      { 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error("Error in agent-communication function:", error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
