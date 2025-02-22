
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TradingAnalysisRequest {
  riskLevel: "low" | "medium" | "high";
  simulationMode: boolean;
  rapidMode: boolean;
}

serve(async (req) => {
  console.log('Trading analysis function started');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    console.log('Attempting to parse request body');
    const requestData: TradingAnalysisRequest = await req.json();
    console.log('Request data:', requestData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    console.log('Initializing Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch latest market data with no filters initially
    console.log('Fetching latest market data');
    const { data: marketData, error: marketError } = await supabase
      .from('market_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (marketError) {
      console.error('Error fetching market data:', marketError);
      throw marketError;
    }

    console.log(`Retrieved ${marketData?.length || 0} market data points`);

    // Generate analysis result
    const analysis = {
      shouldTrade: Math.random() > 0.5,
      recommendedAction: Math.random() > 0.5 ? 'buy' : 'sell',
      recommendedAmount: Math.floor(Math.random() * 100) + 1,
      confidence: Math.floor(Math.random() * 100),
      currentPrice: marketData?.[0]?.price || 0
    };

    console.log('Analysis result:', analysis);

    // Store analysis result
    console.log('Storing analysis result');
    const { error: insertError } = await supabase
      .from('trading_signals')
      .insert({
        signal_type: analysis.recommendedAction,
        price: analysis.currentPrice,
        confidence: analysis.confidence,
        strategy: requestData.rapidMode ? 'RapidFlow AI' : 'QuantumFlow AI',
        volume: analysis.recommendedAmount,
        status: 'pending',
        metadata: {
          riskLevel: requestData.riskLevel,
          simulationMode: requestData.simulationMode
        }
      });

    if (insertError) {
      console.error('Error storing analysis result:', insertError);
      throw insertError;
    }

    console.log('Analysis result stored successfully');

    // Return successful response
    return new Response(
      JSON.stringify(analysis),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Trading analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})
