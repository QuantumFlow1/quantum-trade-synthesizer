
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key',
};

// System prompt template for trading advice
const getSystemPrompt = (userLevel: string) => `
You are an expert trading advisor specializing in cryptocurrency and financial markets analysis.
Respond in a professional, informative tone appropriate for a ${userLevel || 'intermediate'} trader.

Key guidelines:
- Provide data-backed analysis and insights whenever possible
- Explain trading concepts clearly using examples and analogies
- Include relevant risk considerations and warnings
- When asked about specific assets, include technical and fundamental analysis
- Stay neutral and objective, avoiding pushing particular investments
- Never guarantee returns or make promises about future performance
- Format your responses clearly with proper spacing between paragraphs

Remember that trading involves significant risk, and you should always emphasize responsible risk management.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract Groq API key from headers
    const groqApiKey = req.headers.get('x-groq-api-key');
    
    if (!groqApiKey) {
      console.error("Missing Groq API key in request headers");
      return new Response(
        JSON.stringify({
          error: "Missing Groq API key. Please provide your API key in the request headers."
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse the request body
    const { message, userLevel, previousMessages, marketData } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Processing trading advice request:", {
      messageLength: message.length,
      userLevel: userLevel || 'intermediate',
      marketDataAvailable: !!marketData,
      previousMessagesCount: previousMessages?.length || 0
    });
    
    // Build request to Groq API
    const systemMessage = getSystemPrompt(userLevel);
    
    // Prepare context with market data if available
    let contextMessage = '';
    if (marketData && Array.isArray(marketData)) {
      contextMessage = `
Recent market data (for reference):
${marketData.slice(0, 5).map(item => (
  `- ${item.symbol}: $${item.price.toFixed(2)}, Change: ${item.change24h.toFixed(2)}%`
)).join('\n')}
      `;
    }
    
    // Create conversation history, including previous messages if available
    let conversationHistory = [
      { role: "system", content: systemMessage }
    ];
    
    // Add context message if we have market data
    if (contextMessage) {
      conversationHistory.push({ role: "system", content: contextMessage });
    }
    
    // Add previous messages for context
    if (previousMessages && Array.isArray(previousMessages)) {
      conversationHistory = [
        ...conversationHistory,
        ...previousMessages.slice(-6) // Only use the last 6 messages for context
      ];
    }
    
    // Add the current user message
    conversationHistory.push({ role: "user", content: message });
    
    console.log("Sending request to Groq API with", conversationHistory.length, "messages");
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    const result = await response.json();
    const aiResponse = result.choices[0].message.content;
    
    console.log("Successfully generated trading advice response");
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in generate-trading-advice function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred generating trading advice" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
