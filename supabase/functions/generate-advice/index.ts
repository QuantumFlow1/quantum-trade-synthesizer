
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the access token from the request
    const token = authHeader.replace('Bearer ', '');
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    
    // Verify the user exists and is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: userError?.message || 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Generating financial advice for user:", user.id);
    
    try {
      // Get OpenAI API key from environment
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      
      if (!openaiApiKey) {
        console.error("Missing OpenAI API key");
        throw new Error("Server configuration error: Missing API key");
      }

      // Generate personalized financial advice using OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional financial advisor. Provide personalized financial advice that is concise, 
                        practical and actionable. Focus on investment strategies, portfolio diversification, and risk management.
                        Limit your response to 3-4 paragraphs. Use formal language but be approachable.`
            },
            {
              role: 'user',
              content: 'Provide me with personalized financial advice for today\'s market conditions. Focus on current trends and actionable recommendations.'
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`AI service error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const advice = data.choices[0].message.content.trim();
      
      return new Response(
        JSON.stringify({ advice, source: 'ai' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error generating AI advice:", error);
      
      // Fallback to predefined advice if AI fails
      console.log("Falling back to predefined advice");
      const fallbackAdvice = generateFallbackAdvice();
      
      return new Response(
        JSON.stringify({ advice: fallbackAdvice, source: 'fallback' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in edge function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fallback function to generate financial advice
function generateFallbackAdvice(): string {
  const adviceOptions = [
    "Based on current market trends, consider increasing your investment in index funds, which offer diversification and lower fees.",
    "Your portfolio appears to be overexposed to tech stocks. Consider reallocating some assets to more defensive sectors like utilities and consumer staples.",
    "With current inflation rates, I'd recommend looking into Treasury Inflation-Protected Securities (TIPS) or I-bonds to protect your purchasing power.",
    "Consider maximizing your tax-advantaged accounts like 401(k) and IRAs before investing in taxable accounts.",
    "Your emergency fund should cover 3-6 months of expenses. Based on your profile, you might want to increase your cash reserves.",
    "As interest rates stabilize, this could be a good time to refinance any high-interest debt you may have.",
    "Consider dollar-cost averaging into the market rather than trying to time your investments, especially in this volatile environment.",
    "Your current asset allocation suggests you might benefit from increasing your exposure to international markets for better diversification.",
    "With market uncertainties, ensure you have adequate insurance coverage to protect your assets.",
    "Look into dividend-paying stocks or funds for generating passive income as part of your long-term strategy."
  ];
  
  // Return a random piece of advice
  return adviceOptions[Math.floor(Math.random() * adviceOptions.length)];
}
