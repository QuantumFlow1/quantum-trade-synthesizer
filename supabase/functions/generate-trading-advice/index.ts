
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { message, userId, userLevel = 'beginner' } = await req.json();
    console.log(`Processing trading advice request for user ${userId} (${userLevel} level)`);

    // Get user risk settings if available
    let riskProfile = 'moderate';
    let maxPositionSize = 1000;
    
    const { data: riskData, error: riskError } = await supabase
      .from('risk_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (riskData) {
      console.log('User risk settings found:', riskData);
      riskProfile = riskData.risk_level;
      maxPositionSize = riskData.max_position_size;
    } else if (riskError) {
      console.log('No risk settings found, using defaults');
    }

    // Get recent market data
    const { data: marketData, error: marketError } = await supabase
      .from('trading_pairs')
      .select('*')
      .eq('is_active', true)
      .limit(5);

    if (marketError) {
      console.error('Error fetching market data:', marketError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch market data' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user's open positions
    const { data: positionsData, error: positionsError } = await supabase
      .from('positions')
      .select('*')
      .eq('user_id', userId);

    if (positionsError) {
      console.error('Error fetching positions:', positionsError);
    }

    // Prepare context for AI
    const context = {
      riskProfile,
      maxPositionSize,
      marketData: marketData || [],
      openPositions: positionsData || [],
      userLevel
    };

    // Generate advice with OpenAI
    console.log('Generating trading advice with OpenAI');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are EdriziAI, a financial trading assistant specializing in Quantumflow trading strategies.
            
            Follow these guidelines:
            - Adapt your advice to the user's experience level (${userLevel})
            - Consider their risk profile (${riskProfile}) in all recommendations
            - Maximum position size allowed: ${maxPositionSize}
            - If the user is a beginner, focus more on education than specific trading advice
            - For intermediate users, provide both educational content and trading suggestions
            - For advanced users, focus on sophisticated strategies and technical analysis
            - Always emphasize risk management
            - Respond in Dutch unless specifically asked for English
            - Keep responses clear and concise`
          },
          { 
            role: 'user', 
            content: `${message}\n\nCurrent market context: ${JSON.stringify(context)}`
          }
        ],
      }),
    });

    const data = await response.json();
    const generatedAdvice = data.choices[0].message.content;

    // Log the advice being sent back
    console.log('Generated trading advice successfully');

    // Store this interaction for future analysis
    await supabase.from('agent_collected_data').insert({
      agent_id: 'EdriziAI',
      content: { 
        user_query: message,
        generated_advice: generatedAdvice,
        context: context 
      },
      data_type: 'trading_advice',
      source: 'chat_interaction'
    });

    return new Response(
      JSON.stringify({ advice: generatedAdvice }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating trading advice:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
